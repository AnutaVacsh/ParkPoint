package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.ClientDTO;
import ru.vaschenko.ParkPoint.dto.OwnerDTO;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Owner;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClientMapper {

//    @Mapping(target = "password", ignore = true)
    ClientDTO toDTO(Client client);

    Client toEntity(ClientDTO clientDTO);

    List<ClientDTO> ToDTOs(List<Client> clients);
}

