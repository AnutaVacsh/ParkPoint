package ru.vaschenko.ParkPoint.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.validation.annotation.Validated;

import java.util.List;

public record APSearchRequestDto (
        @Min(1) int page,
        @Min(1) @Max(100) int size,
        @Pattern(regexp = "ASC|DESC", flags = Pattern.Flag.CASE_INSENSITIVE) String sortDirection,
        String sortBy,
        List<FilterDTO> filters
){
}
