import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { TestingDashboard } from '@/components/features/dashboard/TestingDashboard';

export default function TestingPage() {
    return (
        <DashboardLayout>
            <TestingDashboard />
        </DashboardLayout>
    );
}
