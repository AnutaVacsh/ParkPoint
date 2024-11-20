package ru.vaschenko.ParkPoint.dto.mapper;
import org.mapstruct.*;
import ru.vaschenko.ParkPoint.dto.AdminDTO;
import ru.vaschenko.ParkPoint.dto.ClientDTO;
import ru.vaschenko.ParkPoint.dto.OwnerDTO;
import ru.vaschenko.ParkPoint.model.Admin;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Owner;
import ru.vaschenko.ParkPoint.model.User;
import ru.vaschenko.ParkPoint.type.Role;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Маппинг для Admin и AdminDTO
//    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "mapRoleToString")
    AdminDTO adminToAdminDTO(Admin admin);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "mapStringToRole")
    Admin adminDTOToAdmin(AdminDTO adminDTO);

    // Маппинг для Owner и OwnerDTO
//    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "mapRoleToString")
    OwnerDTO ownerToOwnerDTO(Owner owner);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "mapStringToRole")
    Owner ownerDTOToOwner(OwnerDTO ownerDTO);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateOwnerFromDTO(OwnerDTO ownerDTO, @MappingTarget Owner owner);

    // Маппинг для Client и ClientDTO
//    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "mapRoleToString")
    ClientDTO clientToClientDTO(Client client);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "mapStringToRole")
    Client clientDTOToClient(ClientDTO clientDTO);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true) // Игнорируем ID при обновлении
    void updateClientFromDTO(ClientDTO clientDTO, @MappingTarget Client client);


    @IterableMapping(elementTargetType = AdminDTO.class)
    List<AdminDTO> adminsToAdminDTOs(List<Admin> admins);

    @IterableMapping(elementTargetType = OwnerDTO.class)
    List<OwnerDTO> ownersToOwnerDTOs(List<Owner> owners);

    @IterableMapping(elementTargetType = ClientDTO.class)
    List<ClientDTO> clientsToClientDTOs(List<Client> clients);

//    @Named("mapRoleToString")
//    default String mapRoleToString(Role role) {
//        return role != null ? role.name() : null;
//    }

    @Named("mapRoleToString")
    default String mapRoleToString(Role role) {  // Изменён метод, теперь он принимает User, а не только Role
        return role != null ? role.name() : null;
    }

    @Named("mapStringToRole")
    default Role mapStringToRole(String str) {
        return str != null ? Role.valueOf(str) : null;
    }
}

