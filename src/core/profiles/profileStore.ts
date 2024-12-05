import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";
import ProfileService from "./ProfileService";
export const ProfilesStore = {
  state: () => ({
    Profiles: [] as IProfile[],
    isLoaded: false as boolean,
  }),

  actions: {
    // Acción para obtener todos los Profiles
    async getAllProfiles(this: any): Promise<IProfile[]> {
      const profileService = new ProfileService();
      const profile = await profileService.getAllProfiles();
      this.Profiles = profile;
      this.isLoaded = true;
      return this.Profiles;
    },

    async saveProfile(this: any, profile: IProfileDTO): Promise<void> {
      const profileService = new ProfileService();
      const newProfile = await profileService.createProfile(profile);
      this.profile.push(newProfile);
      this.isLoaded = true;
    },

    // Action to update an existing Profile
    async updateProfile(
      this: any,
      updatedProfileData: IProfileDTO,
      ProfileId: number
    ): Promise<void> {
      try {
        const profileService = new ProfileService();
        const updatedProfile = await profileService.updateProfile(
          ProfileId,
          updatedProfileData
        );
        const index = this.Profiles.findIndex(
          (Profile: { id: number }) => Profile.id === ProfileId
        );

        if (index !== -1) {
          this.Profiles[index] = updatedProfile;
        } else {
          console.error(`Profile with ID: ${ProfileId} not found.`);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },

    // Action to delete a Profile
    async deleteProfile(this: any, ProfileId: number): Promise<void> {
      if (!ProfileId) {
        throw new Error("deleteProfile: ProfileId is null or undefined");
      }

      const profileService = new ProfileService();
      try {
        await profileService.deleteProfile(ProfileId);
      } catch (error) {
        console.error("Error deleting profile:", error);
        throw error;
      }

      const index = this.Profiles.findIndex(
        (Profile: { id: number }) => Profile.id === ProfileId
      );

      if (index === -1) {
        console.error(`Profile with ID: ${ProfileId} not found.`);
      } else {
        this.Profiles.splice(index, 1);
      }
    },
  },
};
