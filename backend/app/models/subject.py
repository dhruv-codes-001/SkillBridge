from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.tutor_offering import TutorOffering

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Subject(Base):
    __tablename__ = "subjects"

    subject_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    subject_name: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    offerings: Mapped[list["TutorOffering"]] = relationship(
        back_populates="subject"
    )
