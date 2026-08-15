from uuid import UUID

from app.core.exceptions import ConflictException, NotFoundException
from app.models.room import MeetingRoom, RoomStatus
from app.repositories.room_repository import RoomRepository
from app.schemas.room import (
    RoomCreateRequest,
    RoomUpdateRequest,
)


class RoomService:

    def __init__(
        self,
        room_repository: RoomRepository,
    ):
        self.room_repository = room_repository

    async def get_room(
        self,
        room_id: UUID,
    ) -> MeetingRoom:

        room = await self.room_repository.get_by_id(room_id)

        if not room:
            raise NotFoundException("Room not found")

        return room

    async def get_rooms(
        self,
    ) -> list[MeetingRoom]:

        return await self.room_repository.get_all()

    async def create_room(
        self,
        data: RoomCreateRequest,
    ) -> MeetingRoom:

        room = MeetingRoom(
            name=data.name,
            description=data.description,
            capacity=data.capacity,
            status=RoomStatus(data.status),
        )

        return await self.room_repository.create(room)

    async def update_room(
        self,
        room_id: UUID,
        data: RoomUpdateRequest,
    ) -> MeetingRoom:

        room = await self.get_room(room_id)

        updates = data.model_dump(
            exclude_unset=True
        )

        if "status" in updates:
            updates["status"] = RoomStatus(
                updates["status"]
            )

        for key, value in updates.items():
            setattr(room, key, value)

        return await self.room_repository.update(room)

    async def delete_room(
        self,
        room_id: UUID,
    ) -> None:

        room = await self.get_room(room_id)

        await self.room_repository.delete(room)

    async def update_status(
        self,
        room_id: UUID,
        status: str,
    ) -> MeetingRoom:

        room = await self.get_room(room_id)

        room.status = RoomStatus(status)

        return await self.room_repository.update(room)