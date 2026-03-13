import { redirect } from 'next/navigation';

// phone 화면은 personal-info로 통합됨
export default function PhonePage() {
  redirect('/projects/eum/patient/onboarding/personal-info');
}
