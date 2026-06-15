import { UserProfile } from '@/types';
import { LoginSchema, CarbonTwinSchema } from '@/validators';

const USER_PROFILE_KEY = 'carbonos_user_profile';
const USER_SESSION_KEY = 'carbonos_user_session';

/**
 * Service managing profile sessions, credential checks, and carbon twin updates.
 */
export class UserProfileService {
  /**
   * Fetches active user session.
   */
  static async getCurrentUser(): Promise<UserProfile | null> {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(USER_PROFILE_KEY);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Sign in using an email.
   */
  static async signIn(email: string): Promise<UserProfile> {
    // Validate request schema
    LoginSchema.parse({ email });

    let profile = await this.getCurrentUser();
    if (!profile || profile.email !== email) {
      const name = email.split('@')[0];
      profile = {
        uid: Math.random().toString(36).substring(2, 9),
        email,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        sustainabilityScore: 78,
        greenPoints: 620,
        co2SavedKg: 45.5,
        carbonTwin: {
          diet: 'flexitarian',
          transportMode: 'gasoline',
          commuteDistance: 15,
          homeEnergy: 'grid-mix',
          digitalUsage: 'average',
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_SESSION_KEY, profile.uid);
    }
    return profile;
  }

  /**
   * Register a new carbon profile.
   */
  static async signUp(email: string, displayName: string): Promise<UserProfile> {
    // Validate request schema
    LoginSchema.parse({ email, displayName });

    const profile: UserProfile = {
      uid: Math.random().toString(36).substring(2, 9),
      email,
      displayName,
      sustainabilityScore: 70,
      greenPoints: 200,
      co2SavedKg: 0,
      carbonTwin: {
        diet: 'flexitarian',
        transportMode: 'gasoline',
        commuteDistance: 15,
        homeEnergy: 'grid-mix',
        digitalUsage: 'average',
      }
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(USER_SESSION_KEY, profile.uid);
    }
    return profile;
  }

  /**
   * Sign out current user.
   */
  static async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }

  /**
   * Updates user carbon twin settings with strict Zod validation.
   */
  static async updateCarbonTwin(
    twin: UserProfile['carbonTwin']
  ): Promise<UserProfile> {
    // Enforce Zod validation schema
    const validation = CarbonTwinSchema.safeParse(twin);
    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const profile = await this.getCurrentUser();
    if (!profile) throw new Error('User profile not initialized');
    
    const updatedProfile = { ...profile, carbonTwin: twin };
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
    }
    return updatedProfile;
  }
}
