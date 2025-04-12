import { UserDto } from '../../dto/UserDto';
import Role from '../enam/Role';

export const userMockData = new UserDto('mockuser@example.com', Role.CLIENT);
// export const userMockData = new UserDto('mockuser@example.com', Role.OWNER);

console.log(userMockData)