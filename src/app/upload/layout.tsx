import ProtectedRoute from '@/components/ProtectedRoute';
import UploadPageContent from './page';

export default async function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadPageContent />
    </ProtectedRoute>
  );
}
