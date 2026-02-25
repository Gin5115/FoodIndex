import { Search, Clock, ShoppingBag } from 'lucide-react';

const steps = [
    {
        number: 1,
        icon: Search,
        title: "Browse Nearby Deals",
        description: "Explore restaurants, cafes, and bakeries in your neighborhood listing surplus food at significantly discounted prices.",
        color: "primary",
        bgColor: "bg-purple-50 dark:bg-purple-900/30",
        textColor: "text-primary dark:text-purple-400",
        badgeBg: "bg-primary",
        hoverTitleColor: "group-hover:text-primary",
        progressWidth: "w-1/3",
        progressBg: "bg-primary",
        bgNumberHover: "group-hover:text-purple-50 dark:group-hover:text-slate-600"
    },
    {
        number: 2,
        icon: Clock,
        title: "Watch Prices Drop",
        description: "Keep an eye on dynamic pricing. As closing time approaches, the deals get even better for those ready to act fast.",
        color: "orange",
        bgColor: "bg-orange-50 dark:bg-orange-900/30",
        textColor: "text-orange-500 dark:text-orange-400",
        badgeBg: "bg-orange-500",
        hoverTitleColor: "group-hover:text-orange-500",
        progressWidth: "w-2/3",
        progressBg: "bg-orange-500",
        bgNumberHover: "group-hover:text-orange-50 dark:group-hover:text-slate-600"
    },
    {
        number: 3,
        icon: ShoppingBag,
        title: "Grab Your Deal",
        description: "Secure your order securely through the app and pick it up at the specified time window to enjoy your meal.",
        color: "green",
        bgColor: "bg-green-50 dark:bg-green-900/30",
        textColor: "text-green-600 dark:text-green-400",
        badgeBg: "bg-green-600",
        hoverTitleColor: "group-hover:text-green-600",
        progressWidth: "w-full",
        progressBg: "bg-green-600",
        bgNumberHover: "group-hover:text-green-50 dark:group-hover:text-slate-600"
    }
];

function StepCard({ step }) {
    const Icon = step.icon;

    return (
        <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700">
            {/* Background number */}
            <div className={`absolute top-6 right-6 font-bold text-6xl text-slate-100 dark:text-slate-700 opacity-50 select-none -z-0 ${step.bgNumberHover} transition-colors`}>
                {step.number}
            </div>

            <div className="relative z-10 flex flex-col items-start gap-5 h-full">
                {/* Icon with badge */}
                <div className="relative">
                    <div className={`w-14 h-14 rounded-full ${step.bgColor} flex items-center justify-center ${step.textColor} mb-2`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${step.badgeBg} text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-slate-800`}>
                        {step.number}
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <h3 className={`text-xl font-bold text-slate-900 dark:text-white ${step.hoverTitleColor} transition-colors`}>
                        {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {step.description}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mt-auto pt-4 w-full">
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${step.progressBg} ${step.progressWidth} rounded-full`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HowItWorks() {
    return (
        <section className="w-full bg-[#F9FAFB] dark:bg-background-dark py-16 px-4 md:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Section Header */}
                <div className="text-center max-w-2xl mb-12">
                    <h2 className="text-slate-900 dark:text-white text-[32px] md:text-4xl font-bold leading-tight mb-4 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                        Join the movement to fight food waste while saving money. Get your favorite meals for less in three simple steps.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {steps.map((step) => (
                        <StepCard key={step.number} step={step} />
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-12 flex justify-center">
                    <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-hover hover:shadow-lg transition-all">
                        Start Saving Today
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
