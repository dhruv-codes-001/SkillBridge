from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.tutor_offering import TutorOffering
    from app.models.feedback import Feedback

from datetime import datetime, timezone

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Session(Base):
    __tablename__ = "sessions"

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')",
            name="ck_sessions_status",
        ),
    )

    session_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    learner_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id"), index=True, nullable=False
    )
    offering_id: Mapped[int] = mapped_column(
        ForeignKey("tutor_offerings.offering_id"), index=True, nullable=False
    )
    scheduled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(20), default="pending", nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )

    learner: Mapped["User"] = relationship(
        back_populates="sessions_as_learner",
        foreign_keys=[learner_id],
    )
    offering: Mapped["TutorOffering"] = relationship(
        back_populates="sessions"
    )
    feedback: Mapped["Feedback | None"] = relationship(
        back_populates="session",
        uselist=False,
    )
