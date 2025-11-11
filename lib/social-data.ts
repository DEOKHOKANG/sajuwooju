/**
 * Social Features Data Models
 * 친구 관리 및 사주 공유 기능
 */

// Friend Request Status
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

// Saju Privacy Level
export type SajuPrivacyLevel = 'private' | 'friends' | 'public';

// Friend Interface
export interface Friend {
  id: string;
  userId: string;
  name: string;
  email: string;
  profileImage: string;
  status: FriendRequestStatus;
  createdAt: string;
  mutualFriends?: number;
}

// Saju Analysis Interface
export interface SajuAnalysis {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  category: string;
  categoryIcon: string;
  title: string;
  date: string;
  privacy: SajuPrivacyLevel;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  canView: boolean; // 현재 사용자가 볼 수 있는지
}

// Mock Data - Friends
export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'f1',
    userId: 'user1',
    name: '김민지',
    email: 'minji@example.com',
    profileImage: '',
    status: 'accepted',
    createdAt: '2025-01-15',
    mutualFriends: 3,
  },
  {
    id: 'f2',
    userId: 'user2',
    name: '박서준',
    email: 'seojun@example.com',
    profileImage: '',
    status: 'accepted',
    createdAt: '2025-02-20',
    mutualFriends: 5,
  },
  {
    id: 'f3',
    userId: 'user3',
    name: '이하늘',
    email: 'haneul@example.com',
    profileImage: '',
    status: 'pending',
    createdAt: '2025-03-10',
    mutualFriends: 1,
  },
];

// Mock Data - Friend Requests
export const MOCK_FRIEND_REQUESTS: Friend[] = [
  {
    id: 'fr1',
    userId: 'user4',
    name: '최유진',
    email: 'yujin@example.com',
    profileImage: '',
    status: 'pending',
    createdAt: '2025-03-15',
    mutualFriends: 2,
  },
];

// Mock Data - Shared Saju (친구들의 공개된 사주)
export const MOCK_SHARED_SAJU: SajuAnalysis[] = [
  {
    id: 's1',
    userId: 'user1',
    userName: '김민지',
    userImage: '',
    category: '연애운',
    categoryIcon: '💕',
    title: '2025년 봄 연애운세',
    date: '2025-03-01',
    privacy: 'friends',
    viewCount: 12,
    likeCount: 5,
    isLiked: false,
    canView: true,
  },
  {
    id: 's2',
    userId: 'user2',
    userName: '박서준',
    userImage: '',
    category: '재물운',
    categoryIcon: '💰',
    title: '3월 재물운 분석',
    date: '2025-03-05',
    privacy: 'friends',
    viewCount: 8,
    likeCount: 3,
    isLiked: true,
    canView: true,
  },
  {
    id: 's3',
    userId: 'user3',
    userName: '이하늘',
    userImage: '',
    category: '직업운',
    categoryIcon: '💼',
    title: '커리어 운세 보기',
    date: '2025-03-10',
    privacy: 'private',
    viewCount: 0,
    likeCount: 0,
    isLiked: false,
    canView: false, // Private - 볼 수 없음
  },
];

// Mock Data - My Saju Analyses (내 사주 분석 내역)
export const MOCK_MY_SAJU: SajuAnalysis[] = [
  {
    id: 'my1',
    userId: 'test',
    userName: '테스트 사용자',
    userImage: '',
    category: '종합분석',
    categoryIcon: '🌟',
    title: '2025년 운세 종합',
    date: '2025-01-01',
    privacy: 'friends',
    viewCount: 24,
    likeCount: 8,
    isLiked: false,
    canView: true,
  },
  {
    id: 'my2',
    userId: 'test',
    userName: '테스트 사용자',
    userImage: '',
    category: '연애운',
    categoryIcon: '💕',
    title: '봄 연애운세',
    date: '2025-02-14',
    privacy: 'public',
    viewCount: 45,
    likeCount: 12,
    isLiked: false,
    canView: true,
  },
  {
    id: 'my3',
    userId: 'test',
    userName: '테스트 사용자',
    userImage: '',
    category: '재물운',
    categoryIcon: '💰',
    title: '3월 금전운',
    date: '2025-03-01',
    privacy: 'private',
    viewCount: 0,
    likeCount: 0,
    isLiked: false,
    canView: true,
  },
];
