'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserSettings {
  notion_token?: string;
  notion_database_id?: string;
  openai_api_key?: string;
  gemini_api_key?: string;
  serper_api_key?: string;
}

interface UserSettingsProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userId, isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 설정 로드
  useEffect(() => {
    if (isOpen && userId) {
      loadSettings();
    }
  }, [isOpen, userId]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116는 데이터가 없을 때
        throw error;
      }

      if (data) {
        setSettings({
          notion_token: data.notion_token || '',
          notion_database_id: data.notion_database_id || '',
          openai_api_key: data.openai_api_key || '',
          gemini_api_key: data.gemini_api_key || '',
          serper_api_key: data.serper_api_key || ''
        });
      }
    } catch (error) {
      console.error('설정 로드 오류:', error);
      setMessage({ type: 'error', text: '설정을 불러오는 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          notion_token: settings.notion_token || null,
          notion_database_id: settings.notion_database_id || null,
          openai_api_key: settings.openai_api_key || null,
          gemini_api_key: settings.gemini_api_key || null,
          serper_api_key: settings.serper_api_key || null
        });

      if (error) throw error;

      setMessage({ type: 'success', text: '설정이 성공적으로 저장되었습니다!' });
      
      // 3초 후 메시지 제거
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('설정 저장 오류:', error);
      setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFieldStatus = (field: keyof UserSettings) => {
    const value = settings[field];
    if (!value) return 'empty';
    if (field.includes('token') || field.includes('key')) {
      return value.length > 20 ? 'valid' : 'invalid';
    }
    return 'valid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return '유효함';
      case 'invalid':
        return '유효하지 않음';
      default:
        return '설정되지 않음';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            사용자 설정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">설정을 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 메시지 표시 */}
            {message && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-900/50 border border-green-700 text-green-300'
                  : 'bg-red-900/50 border border-red-700 text-red-300'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}

            {/* Notion 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                📝 Notion 설정
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notion API Token
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.notion_token ? 'text' : 'password'}
                      value={settings.notion_token || ''}
                      onChange={(e) => handleInputChange('notion_token', e.target.value)}
                      placeholder="ntn_..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('notion_token')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.notion_token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(getFieldStatus('notion_token'))}
                    <span className="text-xs text-gray-400">
                      {getStatusText(getFieldStatus('notion_token'))}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notion Database ID
                  </label>
                  <input
                    type="text"
                    value={settings.notion_database_id || ''}
                    onChange={(e) => handleInputChange('notion_database_id', e.target.value)}
                    placeholder="23c04fa1c93a80709f9efa8281d3072a"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(getFieldStatus('notion_database_id'))}
                    <span className="text-xs text-gray-400">
                      {getStatusText(getFieldStatus('notion_database_id'))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI API 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                🤖 AI API 설정
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    OpenAI API Key (선택사항)
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.openai_api_key ? 'text' : 'password'}
                      value={settings.openai_api_key || ''}
                      onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('openai_api_key')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.openai_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gemini API Key (선택사항)
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.gemini_api_key ? 'text' : 'password'}
                      value={settings.gemini_api_key || ''}
                      onChange={(e) => handleInputChange('gemini_api_key', e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('gemini_api_key')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.gemini_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Serper API Key (선택사항)
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.serper_api_key ? 'text' : 'password'}
                      value={settings.serper_api_key || ''}
                      onChange={(e) => handleInputChange('serper_api_key', e.target.value)}
                      placeholder="487e5bb296375348f8d7e2b3ed2e0e737ba56697"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('serper_api_key')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.serper_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">💡 도움말</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Notion API Token은 <a href="https://www.notion.so/my-integrations" target="_blank" className="text-blue-400 hover:underline">Notion Integrations</a>에서 생성할 수 있습니다.</li>
                <li>• Database ID는 노션 데이터베이스 URL에서 찾을 수 있습니다.</li>
                <li>• API 키들은 안전하게 암호화되어 저장됩니다.</li>
                <li>• 설정하지 않은 API는 기본 환경 변수를 사용합니다.</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings; 