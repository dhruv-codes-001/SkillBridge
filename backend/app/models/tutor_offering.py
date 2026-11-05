
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.subject import Subject
    from app.models.session import Session


class TutorOffering(Base):
    __tablename__ = "tutor_offerings"

    offering_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    tutor_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id"), index=True, nullable=False
    )
    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subjects.subject_id"), index=True, nullable=False
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    availability: Mapped[str | None] = mapped_column(
        String(255), nullable=True
    )

    tutor: Mapped["User"] = relationship(back_populates="offerings")
    subject: Mapped["Subject"] = relationship(back_populates="offerings")
    sessions: Mapped[list["Session"]] = relationship(
        back_populates="offering"
    )
