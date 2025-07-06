import Aurora from '@/components/ui/Aurora/Aurora';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import ToggleThemeSwitch from '@/components/Switchs/toggleThemeSwitch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { IconBook2, IconEPassport, IconLock, IconAlertCircle, IconSquareRounded, IconSquareRoundedCheck } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { ButtonLoader } from '@/components/Loader/loaders';
import { Button } from '@/components/ui/button';
import ssr from '@/lib/ssr';
import axios from 'axios';
import { toast } from 'sonner';

interface FormData {
    email: string;
    password: string;
    remember: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

const LoginPage: React.FC = () => {
    const [enabled, setEnabled] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState<FormData>({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = React.useState<FormErrors>({});

    const App = ssr.get('Laravel');

    // Extract URL parameters on component mount
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        const passwordParam = urlParams.get('password');
        
        if (emailParam || passwordParam) {
            setFormData(prev => ({
                ...prev,
                email: emailParam || '',
                password: passwordParam || ''
            }));
        }
    }, []);

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation function
    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear specific field error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post('/guest/login', {
                email: formData.email,
                password: formData.password,
                remember: formData.remember
            });

            // on success you might redirect or reload user data
            if (response.data.success) {
                toast.custom((t) => (
                <div className={`p-4 rounded-lg shadow-lg bg-white dark:bg-zinc-800 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
                    <div className="flex items-center gap-2">
                    <IconSquareRoundedCheck className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Logged in Sucessfully!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                     Redirecting you to our home page...
                    </p>
                </div>
                ))
                localStorage.setItem('user', response.data.user);
                 window.location.href = '/home'; 
                console.log("Login successful:", response.data);
            } else {
                setErrors({ general: response.data.message || 'Login failed' });
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setErrors({ general: err.response.data.message || 'Login failed' });
            } else {
                setErrors({ general: 'Network error. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="">
                <Aurora
                    colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>
            
            <div className="absolute bottom-4 right-4">
                <ToggleThemeSwitch variant='premium' className="ml-2" />
            </div>

            <div className="flex justify-center items-center lg:mt-44">
                <Card className="max-w-lg w-full mx-4 shadow-2xl rounded-lg border">
                    <CardHeader className="space-y-0">
                        <h1 className="text-2xl font-extrabold">{App.app.name}</h1>
                        <p className=''>Sign in to your account!</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* General Error Message */}
                        {errors.general && (
                            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                <IconAlertCircle className="h-4 w-4" />
                                <span className="text-sm">{errors.general}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <IconBook2 className="h-5 w-5 text-zinc-400" />
                                </div>
                                <Input
                                    id="email" 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`pl-10 bg-zinc-100/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 ${
                                        errors.email ? 'border-red-500 dark:border-red-400' : ''
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <IconLock className="h-5 w-5 text-zinc-400" />
                                </div>
                                <Input
                                    id="password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`pl-10 bg-zinc-100/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 ${
                                        errors.password ? 'border-red-500 dark:border-red-400' : ''
                                    }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="remember"
                                    checked={formData.remember}
                                    onCheckedChange={(checked) => handleInputChange('remember', checked)}
                                />
                                <Label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-400">Remember me</Label>
                            </div>
                            <a href="#" className="text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <Button 
                            className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200" 
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <ButtonLoader />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-zinc-200 dark:border-zinc-800 pt-4">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Don't have an account?{" "}
                            <a href="/register" className="font-medium text-zinc-900 dark:text-white hover:underline">
                                Sign up
                            </a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default LoginPage;