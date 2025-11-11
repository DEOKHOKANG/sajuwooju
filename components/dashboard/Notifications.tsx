"use client";

import { useState } from "react";
import { Bell, Check, Eye, Heart, Users, MessageCircle, Share2, X } from "lucide-react";
import { MOCK_NOTIFICATIONS, getUnreadCount, getNotificationIcon, type Notification } from "@/lib/social-data";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = getUnreadCount(notifications);
  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationColor = (type: Notification['type']): string => {
    switch (type) {
      case 'friend_request': return 'bg-blue-50 border-blue-200';
      case 'friend_accept': return 'bg-green-50 border-green-200';
      case 'saju_view': return 'bg-purple-50 border-purple-200';
      case 'saju_like': return 'bg-pink-50 border-pink-200';
      case 'comment': return 'bg-violet-50 border-violet-200';
      case 'share': return 'bg-indigo-50 border-indigo-200';
    }
  };

  const getTimeAgo = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return '방금 전';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-violet-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            알림 ({unreadCount})
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>모두 읽음</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              : 'glass-card text-slate-700 hover:bg-slate-100'
          }`}
        >
          전체 ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'unread'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              : 'glass-card text-slate-700 hover:bg-slate-100'
          }`}
        >
          읽지 않음 ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">
            {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-card p-4 transition-all relative group ${
                !notification.isRead ? 'border-2 ' + getNotificationColor(notification.type) : ''
              }`}
            >
              {/* Unread Indicator */}
              {!notification.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold">
                  {notification.fromUserImage ? (
                    <img
                      src={notification.fromUserImage}
                      alt={notification.fromUserName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{notification.fromUserName.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{notification.fromUserName}</span>
                      {' '}
                      <span className="text-slate-600">{notification.message}</span>
                    </p>
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  {notification.targetTitle && (
                    <p className="text-sm text-violet-600 font-medium mb-2">
                      "{notification.targetTitle}"
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500">
                      {getTimeAgo(notification.createdAt)}
                    </p>

                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        읽음 표시
                      </button>
                    )}

                    {notification.targetId && (
                      <Link
                        href={notification.type.startsWith('saju') ? `/share/saju/${notification.targetId}` : '#'}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        자세히 보기 →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Info */}
      <div className="glass-card p-4 bg-slate-50">
        <p className="text-sm text-slate-600">
          💡 <span className="font-medium">알림 설정:</span> 친구가 내 사주를 조회하거나 좋아요를 누르면 실시간으로 알림을 받습니다
        </p>
      </div>
    </div>
  );
}
