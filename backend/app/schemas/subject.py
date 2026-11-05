
from pydantic import BaseModel, ConfigDict, Field


class SubjectCreate(BaseModel):
    subject_name: str = Field(min_length=2, max_length=100)
    description: str | None = None


class SubjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    subject_id: int
    subject_name: str
    description: str | None = None
