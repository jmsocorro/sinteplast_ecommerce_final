import Persistance from "../dao/factory.js";

export default class UserRepository {
  constructor() {
    this.userDao;
    this.init();
  }

  init = async () => {
    this.userDao = await Persistance.getUserPers();
  };

  loginUser = async (user) => {
    return await this.userDao.loginUser(user);
  };

  newUser = async (user) => {
    return await this.userDao.newUser(user);
  };
  getUsers = async (limit = 10, page = 1, query = "{}", sort) => {
    return await this.userDao.getUsers(limit, page, query, sort);
  };
  getUserById = async (id) => {
    return await this.userDao.getUserById(id);
  };
  updateUserRoleById = async (id, role) => {
    const result = await this.userDao.updateUserRoleById(id, role);
    return result;
  };
  updateUserDocsById = async (id, status) => {
    return await this.userDao.updateUserDocsById(id, status);
  };
  resetPassword = async (token) => {
    return await this.userDao.resetPassword(token);
  };
  resetPasswordToken = async (email) => {
    return await this.userDao.resetPasswordToken(email);
  };
  deleteInactivetUsers = async () => {
    return await this.userDao.deleteInactivetUsers();
  }
  deleteUserById = async (id) => {
    return await this.userDao.deleteUserById(id)
  }
  logout = async (id) => {
    return await this.userDao.updateUserLastConnectionById(id)
  }
}
