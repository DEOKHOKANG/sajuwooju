import { NextResponse } from 'next/server';

/**
 * GET /api/categories
 *
 * Returns all fortune categories
 * Production: Will fetch from PostgreSQL via Prisma
 * Development: Uses hardcoded data
 */
export async function GET() {
  try {
    // TODO: Replace with Prisma query when PostgreSQL is deployed
    // const categories = await prisma.fortuneCategory.findMany({
    //   where: { isPublished: true },
    //   orderBy: { order: 'asc' }
    // });

    const categories = [
      {
        id: '1',
        slug: 'event',
        name: '이벤트',
        icon: '🎉',
        color: '#FF6B9D',
        gradient: 'from-pink-400 via-rose-500 to-red-500',
        description: '특별 이벤트 상품',
        keywords: ['할인', '프로모션', '이벤트'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 1,
      },
      {
        id: '2',
        slug: 'compatibility',
        name: '궁합',
        icon: '💕',
        color: '#FF69B4',
        gradient: 'from-pink-300 via-pink-400 to-rose-500',
        description: '사랑 궁합 사주',
        keywords: ['썸', '연애', '궁합'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 2,
      },
      {
        id: '3',
        slug: 'love',
        name: '솔로/연애운',
        icon: '❤️',
        color: '#E91E63',
        gradient: 'from-red-400 via-pink-500 to-rose-600',
        description: '솔로 탈출 및 연애운',
        keywords: ['솔로', '연애', '짝사랑'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 3,
      },
      {
        id: '4',
        slug: 'breakup',
        name: '이별/재회',
        icon: '💔',
        color: '#9C27B0',
        gradient: 'from-purple-400 via-purple-500 to-indigo-600',
        description: '이별 극복 및 재회 운세',
        keywords: ['이별', '재회', '복연'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 4,
      },
      {
        id: '5',
        slug: 'career',
        name: '직장/직업운',
        icon: '💼',
        color: '#3F51B5',
        gradient: 'from-blue-400 via-indigo-500 to-purple-600',
        description: '직장 운세 및 직업 변화',
        keywords: ['취업', '이직', '직장운'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 5,
      },
      {
        id: '6',
        slug: 'money',
        name: '재물/금전운',
        icon: '💰',
        color: '#4CAF50',
        gradient: 'from-green-400 via-emerald-500 to-teal-600',
        description: '재물 및 금전 운세',
        keywords: ['재물', '돈', '재운'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 6,
      },
      {
        id: '7',
        slug: 'marriage',
        name: '결혼운',
        icon: '💒',
        color: '#FF9800',
        gradient: 'from-orange-300 via-orange-400 to-amber-500',
        description: '결혼 운세 및 배우자운',
        keywords: ['결혼', '배우자', '혼인'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 7,
      },
      {
        id: '8',
        slug: 'monthly',
        name: '월별운세',
        icon: '📅',
        color: '#00BCD4',
        gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
        description: '월별 종합 운세',
        keywords: ['월운', '월별', '운세'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: 8,
      },
    ];

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
