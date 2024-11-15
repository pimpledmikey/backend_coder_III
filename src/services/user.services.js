import Users from "../dao/Users.dao.js";
import { customError } from "../errors/custom.error.js";
import { generateUsersMock } from "../mocks/user.mock.js";

export class UserServices {
  constructor() {
    // this.userRepository = new UserRepository(new Users());
    this.userDao = new Users();
  }
  async getAll() {
    const users = await this.userDao.get();
    return users;

  }
  async getUserByEmail(email) {
    const user = await this.userDao.getBy({ email: email }); // Use an object with email
    if (!user) throw customError.notFoundError(`User with email ${email} not found`);
    return user;
  }
  /*
  async getById(id) {

    const user = await this.userDao.getBy(id);

    if (!user) throw customError.notFoundError(`User id ${id} not found`);
    return user;
  }
  */

  // Update the getById method in UserServices
  async getById(id) {
    const user = await this.userDao.getBy({ _id: id }); // Use an object with _id
    if (!user) throw customError.notFoundError(`User id ${id} not found`);
    return user;
  }

  async create(data) {

    const user = await this.userDao.save(data);

    return user;

  }

  async createMany(data) {

    const users = await this.userDao.saveMany(data);

    return users;

  }

  async update(id, data) {
    const user = await this.userDao.update(id, data);
    return user;
  }
  async remove(id) {
    await this.userDao.delete(id);
    return "ok";
  }
  async createMocks() {
    const users = generateUsersMock(10);
    const usersDb = await this.userDao.saveMany(users);
    return usersDb;
  }
}