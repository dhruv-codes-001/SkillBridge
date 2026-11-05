
from datetime import datetime, timezone

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )

    offerings: Mapped[list["TutorOffering"]] = relationship(
        back_populates="tutor"
    )
    sessions_as_learner: Mapped[list["Session"]] = relationship(
        back_populates="learner",
        foreign_keys="Session.learner_id",
    )
    activity_logs: Mapped[list["ActivityLog"]] = relationship(
        back_populates="user"
    )
