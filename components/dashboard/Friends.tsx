"use client";

import { useState } from "react";
import { Users, UserPlus, Check, X, Search, MoreVertical } from "lucide-react";
import { MOCK_FRIENDS, MOCK_FRIEND_REQUESTS, type Friend } from "@/lib/social-data";

export function Friends() {
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [requests, setRequests] = useState<Friend[]>(MOCK_FRIEND_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingFriends = friends.filter(f => f.status === 'pending');

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setRequests(requests.filter(r => r.id !== requestId));
      setFriends([...friends, { ...request, status: 'accepted' }]);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-violet-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            친구 ({acceptedFriends.length})
          </h2>
        </div>
        <button
          onClick={() => setIsAddingFriend(!isAddingFriend)}
          className="glass-button p-2 sm:px-4 sm:py-2 rounded-xl hover:scale-105 transition-all"
        >
          <UserPlus className="w-5 h-5 sm:mr-2 text-violet-600" />
          <span className="hidden sm:inline text-sm font-medium">친구 추가</span>
        </button>
      </div>

      {/* Add Friend Form */}
      {isAddingFriend && (
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800">친구 추가</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="이메일 또는 사용자 이름으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Friend Requests */}
      {requests.length > 0 && (
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800">친구 요청 ({requests.length})</h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 rounded-xl bg-violet-50 border border-violet-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    {request.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{request.name}</p>
                    <p className="text-xs text-slate-500">
                      공통 친구 {request.mutualFriends}명
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h3 className="font-bold text-slate-800">내 친구</h3>
        
        {acceptedFriends.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">아직 친구가 없습니다</p>
            <p className="text-xs mt-1">친구를 추가하고 사주를 공유해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {acceptedFriends.map((friend) => (
              <div
                key={friend.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{friend.name}</p>
                    <p className="text-xs text-slate-500">{friend.email}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Sent Requests */}
      {pendingFriends.length > 0 && (
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800">보낸 친구 요청 ({pendingFriends.length})</h3>
          <div className="space-y-2">
            {pendingFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{friend.name}</p>
                    <p className="text-xs text-slate-500">대기 중</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
