import { useForm } from '@inertiajs/react';
import AuthLayout from '../Layouts/AuthLayout';

export default function ChangePassword() {
    const { data, setData, post, processing, errors } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/password/change');
    };

    return (
        <AuthLayout>
            <form onSubmit={submit}>
                <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    You are required to change your password before continuing.
                </p>

                <div className="mb-4">
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoFocus
                    />
                    {errors.current_password && <div className="mt-1 text-sm text-red-600">{errors.current_password}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                </div>

                <div className="mb-6">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.password_confirmation && <div className="mt-1 text-sm text-red-600">{errors.password_confirmation}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {processing ? 'Changing Password...' : 'Change Password'}
                </button>
            </form>
        </AuthLayout>
    );
}
