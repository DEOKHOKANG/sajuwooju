# Phase 6: Post-Login Features & Detail Pages

**Start Date**: 2025-11-05
**Target Duration**: 2-3 days
**Status**: 🚀 **IN PROGRESS**

---

## 🎯 Phase 6 Overview

Phase 6은 로그인 후 사용 가능한 기능들과 상세 페이지들을 복제하는 단계입니다. 이전 Phase 1-5에서 완료한 홈페이지 기본 구조 위에, 실제 사용자 인터랙션이 가능한 기능들을 추가합니다.

### Current Status (Phase 1-5 Complete)
- ✅ 홈페이지 레이아웃 (102% accuracy)
- ✅ 6개 히어로 슬라이드
- ✅ 10개 카테고리
- ✅ 12개 제품 카드
- ✅ 고객 리뷰 섹션
- ✅ CTA 배너
- ✅ 완전한 푸터
- ✅ 반응형 디자인
- ✅ TypeScript 타입 안전성

### Phase 6 Goals
- 🎯 Kakao 로그인 구현
- 🎯 제품 상세 페이지
- 🎯 사용자 프로필 페이지
- 🎯 예약/구매 플로우
- 🎯 로그인 게이트 라우팅

---

## 📋 Task Breakdown

### 6.1 Authentication System (Day 1)

#### 6.1.1 Kakao OAuth Setup

**Dependencies**:
```bash
npm install next-auth @auth/core
```

**Files to Create**:
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `lib/auth.ts` - Auth helpers
- `middleware.ts` - Protected routes middleware

**Implementation**:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

**Environment Variables**:
```env
KAKAO_CLIENT_ID=your_kakao_app_id
KAKAO_CLIENT_SECRET=your_kakao_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

**Tasks**:
- [ ] Kakao Developer Console에서 앱 생성
- [ ] OAuth Client ID/Secret 발급
- [ ] NextAuth 설정 파일 생성
- [ ] 로그인/로그아웃 버튼 구현
- [ ] 세션 관리 테스트

**Estimated Time**: 3-4 hours

---

#### 6.1.2 Protected Routes Middleware

**File**: `middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/products/:path*",
    "/profile/:path*",
    "/booking/:path*"
  ],
};
```

**Tasks**:
- [ ] Create middleware.ts
- [ ] Define protected routes
- [ ] Test redirect to login

**Estimated Time**: 1 hour

---

#### 6.1.3 Login UI Components

**Files**:
- `app/login/page.tsx` - Login page
- `components/auth/login-button.tsx` - Kakao login button
- `components/auth/logout-button.tsx` - Logout button
- `components/auth/user-menu.tsx` - User dropdown menu

**Login Page Example**:
```typescript
// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">
            사주우주
          </h1>
          <p className="text-slate-400">
            카카오로 간편하게 시작하세요
          </p>
        </div>

        <button
          onClick={() => signIn('kakao', { callbackUrl: '/' })}
          className="w-full bg-[#FEE500] text-[#000000] font-bold py-4 px-6 flex items-center justify-center gap-3 hover:bg-[#FDD835] transition-colors"
          style={{ borderRadius: '12px' }}
        >
          <Image
            src="/kakao-icon.svg"
            alt="Kakao"
            width={24}
            height={24}
          />
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
}
```

**Tasks**:
- [ ] Create login page UI
- [ ] Design Kakao login button (matching brand guidelines)
- [ ] Add logout functionality
- [ ] Update header with user menu

**Estimated Time**: 2-3 hours

---

### 6.2 Product Detail Pages (Day 1-2)

#### 6.2.1 Dynamic Route Setup

**File Structure**:
```
app/
  products/
    [id]/
      page.tsx         # Product detail page
      loading.tsx      # Loading skeleton
      error.tsx        # Error boundary
```

**Tasks**:
- [ ] Create `app/products/[id]/page.tsx`
- [ ] Setup dynamic route params
- [ ] Create loading state
- [ ] Create error boundary

**Estimated Time**: 1 hour

---

#### 6.2.2 Product Detail Page Component

**File**: `app/products/[id]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { FEATURED_PRODUCTS } from '@/lib/products-data';
import { ProductDetailHeader } from '@/components/products/detail-header';
import { ProductDescription } from '@/components/products/description';
import { ProductReviews } from '@/components/products/reviews';
import { BookingButton } from '@/components/products/booking-button';

export async function generateStaticParams() {
  return FEATURED_PRODUCTS.map((product) => ({
    id: product.id.toString(),
  }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = FEATURED_PRODUCTS.find(p => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <ProductDetailHeader product={product} />
      <ProductDescription product={product} />
      <ProductReviews productId={product.id} />
      <BookingButton product={product} />
    </div>
  );
}
```

**Components to Create**:
1. **ProductDetailHeader** - Product image, title, rating
2. **ProductDescription** - Detailed description, what's included
3. **ProductReviews** - Customer reviews specific to product
4. **BookingButton** - Fixed bottom button for booking

**Tasks**:
- [ ] Create product detail layout
- [ ] Implement product header component
- [ ] Add product description section
- [ ] Integrate product reviews
- [ ] Add booking button (fixed bottom)
- [ ] Make product cards clickable (update homepage)

**Estimated Time**: 4-5 hours

---

#### 6.2.3 Make Product Cards Clickable

**Update**: `components/product-card.tsx`

```typescript
import Link from 'next/link';

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-muted-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" style={{ borderRadius: '16px' }}>
        {/* existing product card content */}
      </div>
    </Link>
  );
}
```

**Tasks**:
- [ ] Wrap ProductCard in Link component
- [ ] Add hover effect
- [ ] Test navigation

**Estimated Time**: 30 minutes

---

### 6.3 User Profile Page (Day 2)

#### 6.3.1 Profile Page Layout

**File**: `app/profile/page.tsx`

```typescript
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ProfileHeader } from '@/components/profile/header';
import { PurchaseHistory } from '@/components/profile/purchase-history';
import { ProfileSettings } from '@/components/profile/settings';

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <ProfileHeader user={session.user} />

      <div className="mx-auto w-full max-w-[600px] px-4">
        {/* Navigation tabs */}
        <div className="flex gap-4 border-b border-border mb-6">
          <button className="pb-3 border-b-2 border-secondary text-primary font-medium">
            구매 내역
          </button>
          <button className="pb-3 text-slate-400">
            설정
          </button>
        </div>

        <PurchaseHistory />
      </div>
    </div>
  );
}
```

**Components**:
1. **ProfileHeader** - User avatar, name, email
2. **PurchaseHistory** - List of past purchases
3. **ProfileSettings** - Account settings

**Tasks**:
- [ ] Create profile page layout
- [ ] Implement profile header
- [ ] Add purchase history section (can be mock data initially)
- [ ] Add settings tab
- [ ] Add navigation menu item for profile

**Estimated Time**: 3-4 hours

---

### 6.4 Booking Flow (Day 2-3)

#### 6.4.1 Booking Form

**File**: `app/booking/[productId]/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingForm } from '@/components/booking/form';
import { BookingSummary } from '@/components/booking/summary';

export default function BookingPage({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: '',
  });

  const handleSubmit = async () => {
    // TODO: Submit booking to API
    console.log('Booking submitted:', bookingData);
    router.push('/booking/confirmation');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto w-full max-w-[600px] px-4 py-6">
        <h1 className="font-display text-2xl font-bold text-primary mb-6">
          예약하기
        </h1>

        <BookingForm
          data={bookingData}
          onChange={setBookingData}
        />

        <BookingSummary
          productId={params.productId}
          bookingData={bookingData}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-secondary text-white font-bold py-4 mt-6"
          style={{ borderRadius: '12px' }}
        >
          예약 완료
        </button>
      </div>
    </div>
  );
}
```

**Components**:
1. **BookingForm** - Date/time picker, notes input
2. **BookingSummary** - Order summary, price
3. **BookingConfirmation** - Success page

**Tasks**:
- [ ] Create booking form page
- [ ] Add date/time selection
- [ ] Implement form validation
- [ ] Create booking summary component
- [ ] Add confirmation page
- [ ] (Optional) Payment integration placeholder

**Estimated Time**: 4-5 hours

---

### 6.5 Additional Features

#### 6.5.1 Update Header Navigation

**Update**: `components/layout/mobile-header.tsx`

Add profile menu icon for logged-in users:

```typescript
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/user-menu';

export function MobileHeader() {
  const { data: session } = useSession();

  return (
    <header>
      {/* existing header content */}

      <div className="flex items-center gap-4">
        {session ? (
          <UserMenu user={session.user} />
        ) : (
          <Link href="/login">
            <button className="text-sm text-primary">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
```

**Tasks**:
- [ ] Add session check to header
- [ ] Show user menu when logged in
- [ ] Show login button when logged out
- [ ] Add profile link to menu

**Estimated Time**: 1-2 hours

---

## 📊 Progress Tracking

### Overall Progress
- [ ] 6.1 Authentication System (0/3 tasks)
- [ ] 6.2 Product Detail Pages (0/3 tasks)
- [ ] 6.3 User Profile Page (0/1 task)
- [ ] 6.4 Booking Flow (0/1 task)
- [ ] 6.5 Additional Features (0/1 task)

**Total**: 0% complete

---

## 🎯 Success Criteria

Phase 6는 다음 조건을 모두 만족하면 완료됩니다:

### Functional Requirements
- [ ] Kakao 로그인/로그아웃 동작
- [ ] 보호된 라우트 접근 제어
- [ ] 제품 카드 클릭 시 상세 페이지 이동
- [ ] 제품 상세 페이지 정보 표시
- [ ] 예약 폼 제출 가능
- [ ] 사용자 프로필 페이지 접근 가능

### Technical Requirements
- [ ] 0 TypeScript 에러
- [ ] 모든 페이지 responsive 디자인
- [ ] Next.js 14 App Router 사용
- [ ] NextAuth 세션 관리
- [ ] Protected routes middleware 동작

### Quality Requirements
- [ ] 원본 사이트와 UI 일관성 유지
- [ ] 모든 인터랙션 부드러운 애니메이션
- [ ] Loading states 구현
- [ ] Error boundaries 구현

---

## 📦 Deliverables

1. **Authentication System**
   - Kakao OAuth integration
   - Login/logout flow
   - Session management

2. **Product Detail Pages**
   - Dynamic routing
   - Product information display
   - Booking button

3. **User Profile**
   - User information
   - Purchase history (mock)
   - Settings

4. **Booking Flow**
   - Booking form
   - Date/time selection
   - Confirmation page

5. **Documentation**
   - Phase 6 completion report
   - API integration guide (for future backend)
   - Environment variables guide

---

## 🚀 Getting Started

### Prerequisites
```bash
# Install dependencies
npm install next-auth @auth/core

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Kakao credentials
```

### Development Workflow
1. Complete 6.1 Authentication first (foundation)
2. Then 6.2 Product Detail Pages (main feature)
3. Then 6.3 User Profile
4. Finally 6.4 Booking Flow

### Testing Checklist
- [ ] Login with Kakao works
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Product detail pages load
- [ ] Booking form validates input
- [ ] Profile page shows user data

---

**Phase Start**: 2025-11-05
**Expected Completion**: 2025-11-07
**Status**: 🚧 In Progress
