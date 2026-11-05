
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.tutor_offering import TutorOffering
from app.models.subject import Subject
from app.models.user import User

router = APIRouter(prefix="/api/tutor-offerings", tags=["Tutor Offerings"])


class TutorOfferingCreate(BaseModel):
    subject_id: int = Field(gt=0)
    description: str = Field(min_length=10, max_length=2000)
    availability: str | None = Field(default=None, max_length=255)


class TutorOfferingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    offering_id: int
    tutor_id: int
    subject_id: int
    description: str
    availability: str | None
    tutor_name: str
    subject_name: str


def format_offering(offering: TutorOffering) -> dict:
    return {
        "offering_id": offering.offering_id,
        "tutor_id": offering.tutor_id,
        "subject_id": offering.subject_id,
        "description": offering.description,
        "availability": offering.availability,
        "tutor_name": offering.tutor.name,
        "subject_name": offering.subject.subject_name,
    }


@router.get("", response_model=list[TutorOfferingResponse])
def list_tutor_offerings(db: Session = Depends(get_db)):
    """List tutoring offers with tutor and subject names."""
    statement = (
        select(TutorOffering)
        .options(
            joinedload(TutorOffering.tutor),
            joinedload(TutorOffering.subject),
        )
        .order_by(TutorOffering.offering_id.desc())
    )
    offerings = db.scalars(statement).all()
    return [format_offering(item) for item in offerings]


@router.post("", response_model=TutorOfferingResponse, status_code=status.HTTP_201_CREATED)
def create_tutor_offering(
    data: TutorOfferingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a tutoring offer for the logged-in user."""
    subject = db.get(Subject, data.subject_id)
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found.",
        )

    offering = TutorOffering(
        tutor_id=current_user.user_id,
        subject_id=data.subject_id,
        description=data.description,
        availability=data.availability,
    )

    db.add(offering)
    db.commit()
    db.refresh(offering)

    offering = db.scalar(
        select(TutorOffering)
        .options(
            joinedload(TutorOffering.tutor),
            joinedload(TutorOffering.subject),
        )
        .where(TutorOffering.offering_id == offering.offering_id)
    )

    return format_offering(offering)


@router.get("/mine", response_model=list[TutorOfferingResponse])
def list_my_offerings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List offers created by the logged-in user."""
    statement = (
        select(TutorOffering)
        .options(
            joinedload(TutorOffering.tutor),
            joinedload(TutorOffering.subject),
        )
        .where(TutorOffering.tutor_id == current_user.user_id)
        .order_by(TutorOffering.offering_id.desc())
    )
    offerings = db.scalars(statement).all()
    return [format_offering(item) for item in offerings]


@router.delete("/{offering_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tutor_offering(
    offering_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an offer only if it belongs to the logged-in user."""
    offering = db.get(TutorOffering, offering_id)

    if offering is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tutor offering not found.",
        )

    if offering.tutor_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own tutoring offers.",
        )

    db.delete(offering)
    db.commit()
    return None
