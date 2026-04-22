'use client';

import { useParams } from 'next/navigation';
import NewPropertyPage from '../../new/page';

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  if (!id) return null;
  return <NewPropertyPage editId={id} />;
}
