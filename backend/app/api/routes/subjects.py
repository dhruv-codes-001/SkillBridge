
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectResponse


router = APIRouter(prefix="/api/subjects", tags=["Subjects"])


@router.get("", response_model=list[SubjectResponse])
def list_subjects(db: Session = Depends(get_db)):
    """Return all available subjects."""
    statement = select(Subject).order_by(Subject.subject_name)
    return db.scalars(statement).all()


@router.post(
    "",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
):
    """Create a new subject."""
    subject_name = subject_data.subject_name.strip()

    if len(subject_name) < 2:
        raise HTTPException(
            status_code=422,
            detail="Subject name must contain at least two characters.",
        )

    existing_subject = db.scalar(
        select(Subject).where(
            Subject.subject_name == subject_name
        )
    )

    if existing_subject:
        raise HTTPException(
            status_code=409,
            detail="This subject already exists.",
        )

    subject = Subject(
        subject_name=subject_name,
        description=subject_data.description,
    )

    db.add(subject)

    try:
        db.commit()
        db.refresh(subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="This subject already exists.",
        )

    return subject
