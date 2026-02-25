import { Edit2, ArrowRight } from 'lucide-react';

function UserProfile({ user }) {
    const {
        name = 'John Doe',
        email = 'john.doe@example.com',
        avatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjYYsGEySxX8n5Zt7H-6fHVcocZnbcf0dJqcCNEbTtwuBELAxgFyUy-1p_2wE6kkH35BlyOyS0Usi4ZdpJlLmms6hnRZ3nhmnLM4NVkeFpCnXDdI0iyMH4vgxCsFE1__6ZDbPBIAFTXJGOd3MauNZrCWQbcsvyNhD7kAM7SS1r5rU52qeCyAa8809mkDL7P6Kqw1yCi8e444JMsw0VqP7-ubxb2HeIxcMu_3mWoOS40uvuvBDj1VPmk17MsAcegDkxqg1lBGJ9LdD1',
    } = user || {};

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
            {/* Avatar */}
            <div className="relative group">
                <img
                    src={avatar}
                    alt={name}
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-800 shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary-hover transition">
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-3">{email}</p>
                <a
                    href="#"
                    className="inline-flex items-center text-primary font-medium hover:text-primary-hover transition-colors text-sm"
                >
                    Edit Profile
                    <ArrowRight className="w-4 h-4 ml-1" />
                </a>
            </div>
        </div>
    );
}

export default UserProfile;
