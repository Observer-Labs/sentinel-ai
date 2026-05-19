export type CompetitorType = 'website' | 'social' | 'both'
export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok'
export type AlertType = 'website_change' | 'price_change' | 'social_post' | 'follower_change' | 'engagement_change'
export type Severity = 'low' | 'medium' | 'high'
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly'
export type CheckFrequency = 'hourly' | 'daily' | 'weekly'
export type NotificationChannel = 'in_app' | 'email' | 'whatsapp'

export interface SocialAccount {
  platform: Platform
  handle: string
  url: string
}

export interface Competitor {
  id: string
  user_id: string
  name: string
  type: CompetitorType
  website_url?: string
  social_accounts: SocialAccount[]
  category: string
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  competitor_id: string
  user_id: string
  type: AlertType
  title: string
  description?: string
  change_data?: {
    old_value?: string
    new_value?: string
    diff?: string
    url?: string
  }
  severity: Severity
  is_read: boolean
  snoozed_until?: string
  created_at: string
  updated_at: string
  competitor?: Competitor
}

export interface Profile {
  id: string
  team_name?: string
  industry?: string
  whatsapp_number?: string
  notification_frequency: NotificationFrequency
  notification_channels: NotificationChannel[]
  created_at: string
  updated_at: string
}

export interface WebsiteMonitor {
  id: string
  competitor_id: string
  url: string
  check_frequency: CheckFrequency
  last_checked?: string
  last_snapshot?: string
  is_active: boolean
  created_at: string
}

export interface SocialMetrics {
  id: string
  competitor_id: string
  platform: Platform
  follower_count?: number
  engagement_rate?: number
  last_post_date?: string
  last_checked: string
  created_at: string
}

export interface AlertWithCompetitor extends Alert {
  competitors: Pick<Competitor, 'id' | 'name' | 'type'>
}
