import IProfile from "./IProfile";

class IProfileDTO implements IProfile {
  id: number;
  firstName: string;
  lastName1: string;
  lastName2: string;
  relationship: string;
  email: string;
  avatar: string;
  city: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;

  constructor(profile: IProfile) {
    this.id = profile.id;
    this.firstName = profile.firstName;
    this.lastName1 = profile.lastName1;
    this.lastName2 = profile.lastName2;
    this.relationship = profile.relationship;
    this.email = profile.email;
    this.avatar = profile.avatar;
    this.city = profile.city;
    this.country = profile.country;
    this.phone = profile.phone;
    this.password = profile.password;
    this.confirmPassword = profile.confirmPassword;
  }
}

export default IProfileDTO;
