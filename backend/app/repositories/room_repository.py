from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.room import MeetingRoom, RoomStatus


class RoomRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(
        self,
        room_id: UUID,
    ) -> MeetingRoom | None:
        result = await self.db.execute(
            select(MeetingRoom).where(
                MeetingRoom.id == room_id
            )
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        active_only: bool = False,
    ) -> list[MeetingRoom]:

        query = select(MeetingRoom)

        if active_only:
            query = query.where(
                MeetingRoom.status == RoomStatus.ACTIVE
            )

        query = query.order_by(MeetingRoom.name)

        result = await self.db.execute(query)

        return list(result.scalars().all())

    async def create(
        self,
        room: MeetingRoom,
    ) -> MeetingRoom:
        self.db.add(room)
        await self.db.flush()
        await self.db.refresh(room)
        return room

    async def update(
        self,
        room: MeetingRoom,
    ) -> MeetingRoom:
        await self.db.flush()
        await self.db.refresh(room)
        return room

    async def delete(
        self,
        room: MeetingRoom,
    ) -> None:
        await self.db.delete(room)
        await self.db.flush()