import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mounted = useRef(true);

  useEffect(() => {

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        mounted.current = true;
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setError("Unable to verify authentication");
          setUser(null);
          setIsLoading(false);
          return;
        }

        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          setUser(null);
          setIsLoading(false);
          return;
        }
        if (authUser) {
          console.log('User found after refresh:', authUser.id);
          await fetchUserProfile(authUser.id);
          setIsLoading(false);
        } else {
          console.log('No user found initially – waiting for onAuthStateChange to handle session');
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Unexpected auth init error:', e);
        setUser(null);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current) return;

      console.log('Auth state changed:', event, !!session?.user);

      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          console.log('Auth state change - fetching profile for:', session.user.id);
          await fetchUserProfile(session.user.id);
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If user doesn't exist in users table, create a basic profile
        if (error.code === 'PGRST116') {
          console.log('User profile not found, checking auth user...');
          
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            console.log('Creating user profile for:', authUser.id);
            
            // Create user profile
            const { data: newProfile, error: insertError } = await supabase
              .from('users')
              .insert({
                id: authUser.id,
                email: authUser.email || '',
                full_name: authUser.user_metadata?.full_name || '',
                phone: authUser.user_metadata?.phone || '',
                is_admin: authUser.email === 'admin@888rent.al'
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error creating user profile:', insertError);
              setUser(null);
              setIsLoading(false);
              return;
            }

            if (newProfile) {
              const userProfile: User = {
                id: newProfile.id,
                email: newProfile.email,
                fullName: newProfile.full_name || '',
                phone: newProfile.phone || '',
                isAdmin: newProfile.is_admin || false
              };
              console.log('Created and set user profile:', userProfile);
              if (mounted){
                setUser(userProfile);
                setIsLoading(false);
              }
            }
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
        return;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          email: data.email,
          fullName: data.full_name || '',
          phone: data.phone || '',
          isAdmin: data.is_admin || false
        };
        console.log('Set user profile:', userProfile);
        if (mounted){
          setUser(userProfile);
          setIsLoading(false);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', emailOrUsername);

      // Check if it's admin username
      if (emailOrUsername === 'admin888') {
        console.log('Admin login attempt');
        
        // Validate admin credentials securely via edge function
        const { data: adminData, error: adminError } = await supabase.functions.invoke('admin-auth', {
          body: { username: emailOrUsername, password }
        });

        if (adminError || !adminData?.success) {
          console.error('Admin auth failed:', adminError);
          setIsLoading(false);
          return { success: false, error: 'Invalid admin credentials' };
        }

        if (adminData.success && adminData.isAdmin) {
          console.log('Admin credentials validated, signing in...');
          
          // Sign in with admin email
          const { data, error } = await supabase.auth.signInWithPassword({
            email: adminData.adminEmail,
            password: password
          });

          if (error) {
            console.log('Admin user not found, creating...');
            
            // If admin doesn't exist, create admin account
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: adminData.adminEmail,
              password: password,
              options: {
                data: {
                  full_name: 'Administrator',
                  phone: ''
                }
              }
            });

            if (signUpError) {
              console.error('Error creating admin:', signUpError);
              setIsLoading(false);
              return { success: false, error: 'Failed to create admin account' };
            }

            if (signUpData.user) {
              console.log('Admin account created successfully');
              return { success: true };
            }
          } else if (data.user) {
            console.log('Admin login successful');
            await fetchUserProfile(data.user.id);
            return { success: true };
          }
        }
      } else {
        console.log('Regular user login attempt');
        
        // Regular user login with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password: password
        });

        if (error) {
          console.error('Login error:', error);
          setIsLoading(false);
          
          if (error.message.includes('Invalid login credentials')) {
            return { success: false, error: 'Invalid email or password' };
          } else if (error.message.includes('Email not confirmed')) {
            return { success: false, error: 'Please check your email and confirm your account' };
          } else {
            return { success: false, error: error.message };
          }
        }

        if (data.user) {
          console.log('Regular user login successful');
          await fetchUserProfile(data.user.id);
          return { success: true };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Login failed' };
  };

  const register = async (email: string, password: string, fullName: string, phone: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        
        if (error.message.includes('User already registered') || 
            error.message.includes('already been registered')) {
          return { success: false, error: 'An account with this email already exists. Please try logging in instead.' };
        } else if (error.message.includes('Password should be at least')) {
          return { success: false, error: 'Password must be at least 6 characters long' };
        } else if (error.message.includes('Unable to validate email address')) {
          return { success: false, error: 'Please enter a valid email address' };
        } else {
          return { success: false, error: error.message };
        }
      }

      if (data.user) {
        console.log('Registration successful for:', data.user.id, ". Please proceed to login.");
        setIsLoading(false);
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred during registration' };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Registration failed' };
  };

const logout = async () => {
  console.log('Logging out...');
  setIsLoading(true);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
  }

  // 👇 Do this explicitly to ensure state resets
  setUser(null);
  setIsLoading(false);
};


  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};