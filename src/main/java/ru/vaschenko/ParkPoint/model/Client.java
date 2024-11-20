package ru.vaschenko.ParkPoint.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.*;
import ru.vaschenko.ParkPoint.type.Role;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "Client")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Client extends User{
    private String phoneNumber;

    public Client(Long id, String email, Password password, Role role, String phoneNumber) {
        super(id, email, password, role);
        this.phoneNumber = phoneNumber;
    }

//    @Override
//    public String toString() {
//        return "Client{" +
//                "phoneNumber='" + phoneNumber + '\'' +
//                ", role=" + role +
//                ", password=" + password +
//                ", email='" + email + '\'' +
//                ", id=" + id +
//                '}';
//    }
}
