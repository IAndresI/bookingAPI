class UserModel {
  constructor(id, firstName, lastName, email, userName, phone, isActive, createdAt, password, role) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userName = userName;
    this.phone = phone;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.password = password;
    this.role = role;
  }
}

module.exports = UserModel;