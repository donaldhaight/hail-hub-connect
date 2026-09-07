export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      backlog_comments: {
        Row: {
          author_id: string | null
          author_kind: string
          body: string
          created_at: string
          id: string
          item_id: string
        }
        Insert: {
          author_id?: string | null
          author_kind?: string
          body: string
          created_at?: string
          id?: string
          item_id: string
        }
        Update: {
          author_id?: string | null
          author_kind?: string
          body?: string
          created_at?: string
          id?: string
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backlog_comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "backlog_items"
            referencedColumns: ["id"]
          },
        ]
      }
      backlog_items: {
        Row: {
          build_requested_at: string | null
          build_requested_by: string | null
          category: string
          created_at: string
          created_by: string | null
          detail: string
          id: string
          position: number
          priority: number
          sprint_label: string | null
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          build_requested_at?: string | null
          build_requested_by?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          detail?: string
          id?: string
          position?: number
          priority?: number
          sprint_label?: string | null
          status?: string
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          build_requested_at?: string | null
          build_requested_by?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          detail?: string
          id?: string
          position?: number
          priority?: number
          sprint_label?: string | null
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      briefing_request_events: {
        Row: {
          action: string
          actor_id: string | null
          briefing_request_id: string
          created_at: string
          id: string
          note: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          briefing_request_id: string
          created_at?: string
          id?: string
          note?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          briefing_request_id?: string
          created_at?: string
          id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefing_request_events_briefing_request_id_fkey"
            columns: ["briefing_request_id"]
            isOneToOne: false
            referencedRelation: "briefing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_requests: {
        Row: {
          acknowledged: boolean
          anchor: string | null
          context: string | null
          created_at: string
          email: string
          granted_at: string | null
          granted_by: string | null
          granted_role: string | null
          id: string
          interest: string
          internal_notes: string | null
          name: string
          organization: string
          requested_role: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged?: boolean
          anchor?: string | null
          context?: string | null
          created_at?: string
          email: string
          granted_at?: string | null
          granted_by?: string | null
          granted_role?: string | null
          id?: string
          interest: string
          internal_notes?: string | null
          name: string
          organization: string
          requested_role?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged?: boolean
          anchor?: string | null
          context?: string | null
          created_at?: string
          email?: string
          granted_at?: string | null
          granted_by?: string | null
          granted_role?: string | null
          id?: string
          interest?: string
          internal_notes?: string | null
          name?: string
          organization?: string
          requested_role?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      broadcast_checklist: {
        Row: {
          checked_at: string | null
          checked_by: string | null
          created_at: string
          id: string
          item_key: string
          label: string
          updated_at: string
        }
        Insert: {
          checked_at?: string | null
          checked_by?: string | null
          created_at?: string
          id?: string
          item_key: string
          label: string
          updated_at?: string
        }
        Update: {
          checked_at?: string | null
          checked_by?: string | null
          created_at?: string
          id?: string
          item_key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      broadcast_config: {
        Row: {
          embed_url: string | null
          ended_at: string | null
          fallback_message: string
          id: string
          provider: string
          replay_url: string | null
          started_at: string | null
          state: string
          stream_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          embed_url?: string | null
          ended_at?: string | null
          fallback_message?: string
          id?: string
          provider?: string
          replay_url?: string | null
          started_at?: string | null
          state?: string
          stream_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          embed_url?: string | null
          ended_at?: string | null
          fallback_message?: string
          id?: string
          provider?: string
          replay_url?: string | null
          started_at?: string | null
          state?: string
          stream_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      canvass_coverage: {
        Row: {
          county: string
          created_at: string
          cycles_covered: number
          earliest_cycle: number
          households: number
          id: string
          latest_cycle: number
          precincts: number
          records: number
          registered_voters: number
          source: string
          state: string
          truth_label: string
          turnout_rate: number
          updated_at: string
        }
        Insert: {
          county: string
          created_at?: string
          cycles_covered?: number
          earliest_cycle?: number
          households?: number
          id?: string
          latest_cycle?: number
          precincts?: number
          records?: number
          registered_voters?: number
          source?: string
          state: string
          truth_label?: string
          turnout_rate?: number
          updated_at?: string
        }
        Update: {
          county?: string
          created_at?: string
          cycles_covered?: number
          earliest_cycle?: number
          households?: number
          id?: string
          latest_cycle?: number
          precincts?: number
          records?: number
          registered_voters?: number
          source?: string
          state?: string
          truth_label?: string
          turnout_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      concept_track_notes: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          kind: string
          position: number
          resolved: boolean
          track_id: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          position?: number
          resolved?: boolean
          track_id: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          position?: number
          resolved?: boolean
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concept_track_notes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "concept_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_tracks: {
        Row: {
          brief: string
          created_at: string
          created_by: string | null
          id: string
          layers: string[]
          name: string
          position: number
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          brief?: string
          created_at?: string
          created_by?: string | null
          id?: string
          layers?: string[]
          name: string
          position?: number
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          brief?: string
          created_at?: string
          created_by?: string | null
          id?: string
          layers?: string[]
          name?: string
          position?: number
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      conference_applications: {
        Row: {
          access_token: string
          acknowledged: boolean
          attendee_notes: string | null
          briefing_request_id: string | null
          confirmed_at: string | null
          context: string | null
          created_at: string
          delegate_seat_status: string
          dietary_restrictions: string | null
          email: string
          hotel_needed: boolean
          id: string
          interest: string
          internal_notes: string | null
          logistics_notes: string | null
          name: string
          organization: string
          plus_ones: number
          season_id: string
          seat_status: string
          second_congress_credential: string
          status: string
          ticket_credential: string
          ticket_status: string
          ticket_tier: string
          title: string
          updated_at: string
        }
        Insert: {
          access_token?: string
          acknowledged?: boolean
          attendee_notes?: string | null
          briefing_request_id?: string | null
          confirmed_at?: string | null
          context?: string | null
          created_at?: string
          delegate_seat_status?: string
          dietary_restrictions?: string | null
          email: string
          hotel_needed?: boolean
          id?: string
          interest: string
          internal_notes?: string | null
          logistics_notes?: string | null
          name: string
          organization: string
          plus_ones?: number
          season_id?: string
          seat_status?: string
          second_congress_credential?: string
          status?: string
          ticket_credential?: string
          ticket_status?: string
          ticket_tier?: string
          title: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          acknowledged?: boolean
          attendee_notes?: string | null
          briefing_request_id?: string | null
          confirmed_at?: string | null
          context?: string | null
          created_at?: string
          delegate_seat_status?: string
          dietary_restrictions?: string | null
          email?: string
          hotel_needed?: boolean
          id?: string
          interest?: string
          internal_notes?: string | null
          logistics_notes?: string | null
          name?: string
          organization?: string
          plus_ones?: number
          season_id?: string
          seat_status?: string
          second_congress_credential?: string
          status?: string
          ticket_credential?: string
          ticket_status?: string
          ticket_tier?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conference_applications_briefing_request_id_fkey"
            columns: ["briefing_request_id"]
            isOneToOne: false
            referencedRelation: "briefing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      conference_itinerary_items: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          location: string | null
          position: number
          segment_type: string | null
          speaker: string | null
          time_label: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          location?: string | null
          position?: number
          segment_type?: string | null
          speaker?: string | null
          time_label: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          location?: string | null
          position?: number
          segment_type?: string | null
          speaker?: string | null
          time_label?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conference_seat_events: {
        Row: {
          action: string
          actor_id: string | null
          application_id: string
          created_at: string
          id: string
          note: string | null
          updated_at: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          application_id: string
          created_at?: string
          id?: string
          note?: string | null
          updated_at?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          application_id?: string
          created_at?: string
          id?: string
          note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conference_seat_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "conference_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_attachment_opens: {
        Row: {
          attachment_id: string
          dossier_slug: string
          id: string
          opened_at: string
          user_id: string
        }
        Insert: {
          attachment_id: string
          dossier_slug: string
          id?: string
          opened_at?: string
          user_id: string
        }
        Update: {
          attachment_id?: string
          dossier_slug?: string
          id?: string
          opened_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_attachment_opens_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "dossier_attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_attachments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          dossier_slug: string
          external_url: string | null
          extracted_text: string | null
          id: string
          is_published: boolean
          kind: string
          layers: string[]
          mime_type: string | null
          original_date: string | null
          position: number
          section_id: string | null
          significance: string | null
          size_bytes: number | null
          source_label: string | null
          storage_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          dossier_slug: string
          external_url?: string | null
          extracted_text?: string | null
          id?: string
          is_published?: boolean
          kind: string
          layers?: string[]
          mime_type?: string | null
          original_date?: string | null
          position?: number
          section_id?: string | null
          significance?: string | null
          size_bytes?: number | null
          source_label?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          dossier_slug?: string
          external_url?: string | null
          extracted_text?: string | null
          id?: string
          is_published?: boolean
          kind?: string
          layers?: string[]
          mime_type?: string | null
          original_date?: string | null
          position?: number
          section_id?: string | null
          significance?: string | null
          size_bytes?: number | null
          source_label?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_attachments_dossier_slug_fkey"
            columns: ["dossier_slug"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "dossier_attachments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "dossier_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_edits: {
        Row: {
          actor_id: string
          after_value: string | null
          before_value: string | null
          created_at: string
          dossier_slug: string
          field: string
          id: string
          section_id: string | null
        }
        Insert: {
          actor_id: string
          after_value?: string | null
          before_value?: string | null
          created_at?: string
          dossier_slug: string
          field: string
          id?: string
          section_id?: string | null
        }
        Update: {
          actor_id?: string
          after_value?: string | null
          before_value?: string | null
          created_at?: string
          dossier_slug?: string
          field?: string
          id?: string
          section_id?: string | null
        }
        Relationships: []
      }
      dossier_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          dossier_slug: string
          id: string
          section_heading: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          dossier_slug: string
          id?: string
          section_heading?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          dossier_slug?: string
          id?: string
          section_heading?: string | null
        }
        Relationships: []
      }
      dossier_notes: {
        Row: {
          author_id: string
          body: string
          created_at: string
          dossier_slug: string
          id: string
          section_heading: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          dossier_slug: string
          id?: string
          section_heading?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          dossier_slug?: string
          id?: string
          section_heading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dossier_section_reads: {
        Row: {
          dossier_slug: string
          dwell_ms: number
          first_seen_at: string
          id: string
          last_seen_at: string
          read_confirmed_at: string | null
          section_id: string
          user_id: string
        }
        Insert: {
          dossier_slug: string
          dwell_ms?: number
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          read_confirmed_at?: string | null
          section_id: string
          user_id: string
        }
        Update: {
          dossier_slug?: string
          dwell_ms?: number
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          read_confirmed_at?: string | null
          section_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_section_reads_dossier_slug_fkey"
            columns: ["dossier_slug"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "dossier_section_reads_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "dossier_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_sections: {
        Row: {
          body: string
          created_at: string
          dossier_slug: string
          heading: string
          id: string
          position: number
          truth: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          dossier_slug: string
          heading: string
          id?: string
          position: number
          truth: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          dossier_slug?: string
          heading?: string
          id?: string
          position?: number
          truth?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_sections_dossier_slug_fkey"
            columns: ["dossier_slug"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["slug"]
          },
        ]
      }
      dossiers: {
        Row: {
          code: string
          confidentiality: string
          created_at: string
          published_at: string | null
          slug: string
          story_order: number
          summary: string
          title: string
          truth_default: string
          updated_at: string
        }
        Insert: {
          code: string
          confidentiality: string
          created_at?: string
          published_at?: string | null
          slug: string
          story_order: number
          summary: string
          title: string
          truth_default: string
          updated_at?: string
        }
        Update: {
          code?: string
          confidentiality?: string
          created_at?: string
          published_at?: string | null
          slug?: string
          story_order?: number
          summary?: string
          title?: string
          truth_default?: string
          updated_at?: string
        }
        Relationships: []
      }
      economics_assumptions: {
        Row: {
          base: number
          created_at: string
          definition: string
          high: number
          id: string
          key: string
          label: string
          low: number
          position: number
          source: string
          stage: string
          truth_label: string
          unit: string
          updated_at: string
        }
        Insert: {
          base?: number
          created_at?: string
          definition?: string
          high?: number
          id?: string
          key: string
          label: string
          low?: number
          position?: number
          source?: string
          stage: string
          truth_label?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          base?: number
          created_at?: string
          definition?: string
          high?: number
          id?: string
          key?: string
          label?: string
          low?: number
          position?: number
          source?: string
          stage?: string
          truth_label?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      insider_access_log: {
        Row: {
          dossier_slug: string
          id: string
          opened_at: string
          user_id: string
        }
        Insert: {
          dossier_slug: string
          id?: string
          opened_at?: string
          user_id: string
        }
        Update: {
          dossier_slug?: string
          id?: string
          opened_at?: string
          user_id?: string
        }
        Relationships: []
      }
      insider_invitations: {
        Row: {
          briefing_request_id: string | null
          conference_application_id: string | null
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          full_name: string | null
          id: string
          internal_note: string | null
          organization: string | null
          redeemed_at: string | null
          redeemed_by: string | null
          revoked_at: string | null
          role_category: string | null
          source: string
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          briefing_request_id?: string | null
          conference_application_id?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          full_name?: string | null
          id?: string
          internal_note?: string | null
          organization?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
          revoked_at?: string | null
          role_category?: string | null
          source?: string
          status?: string
          token?: string
          updated_at?: string
        }
        Update: {
          briefing_request_id?: string | null
          conference_application_id?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          internal_note?: string | null
          organization?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
          revoked_at?: string | null
          role_category?: string | null
          source?: string
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insider_invitations_briefing_request_id_fkey"
            columns: ["briefing_request_id"]
            isOneToOne: false
            referencedRelation: "briefing_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insider_invitations_conference_application_id_fkey"
            columns: ["conference_application_id"]
            isOneToOne: false
            referencedRelation: "conference_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      insider_referrals: {
        Row: {
          context: string
          created_at: string
          founder_note: string | null
          id: string
          nominee_email: string
          nominee_name: string
          nominee_organization: string | null
          nominee_role: string | null
          referrer_id: string
          resulting_invitation_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          context: string
          created_at?: string
          founder_note?: string | null
          id?: string
          nominee_email: string
          nominee_name: string
          nominee_organization?: string | null
          nominee_role?: string | null
          referrer_id: string
          resulting_invitation_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          context?: string
          created_at?: string
          founder_note?: string | null
          id?: string
          nominee_email?: string
          nominee_name?: string
          nominee_organization?: string | null
          nominee_role?: string | null
          referrer_id?: string
          resulting_invitation_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insider_referrals_resulting_invitation_id_fkey"
            columns: ["resulting_invitation_id"]
            isOneToOne: false
            referencedRelation: "insider_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_items: {
        Row: {
          created_at: string
          created_by: string | null
          external_url: string | null
          extracted_text: string | null
          filed_as: string | null
          filed_ref: string | null
          id: string
          kind: string
          layers: string[]
          mime_type: string | null
          notes: string | null
          original_date: string | null
          size_bytes: number | null
          source_label: string | null
          storage_path: string | null
          title: string
          triage_state: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          external_url?: string | null
          extracted_text?: string | null
          filed_as?: string | null
          filed_ref?: string | null
          id?: string
          kind?: string
          layers?: string[]
          mime_type?: string | null
          notes?: string | null
          original_date?: string | null
          size_bytes?: number | null
          source_label?: string | null
          storage_path?: string | null
          title: string
          triage_state?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          external_url?: string | null
          extracted_text?: string | null
          filed_as?: string | null
          filed_ref?: string | null
          id?: string
          kind?: string
          layers?: string[]
          mime_type?: string | null
          notes?: string | null
          original_date?: string | null
          size_bytes?: number | null
          source_label?: string | null
          storage_path?: string | null
          title?: string
          triage_state?: string
          updated_at?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          counterparty_wallet_id: string | null
          created_at: string
          direction: string
          id: string
          memo: string
          occurred_at: string
          reason: string
          ref: string
          token_code: string
          wallet_id: string
        }
        Insert: {
          amount: number
          counterparty_wallet_id?: string | null
          created_at?: string
          direction: string
          id?: string
          memo?: string
          occurred_at?: string
          reason: string
          ref?: string
          token_code: string
          wallet_id: string
        }
        Update: {
          amount?: number
          counterparty_wallet_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          memo?: string
          occurred_at?: string
          reason?: string
          ref?: string
          token_code?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_counterparty_wallet_id_fkey"
            columns: ["counterparty_wallet_id"]
            isOneToOne: false
            referencedRelation: "ledger_wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_token_code_fkey"
            columns: ["token_code"]
            isOneToOne: false
            referencedRelation: "ledger_tokens"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "ledger_entries_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "ledger_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_tokens: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          name: string
          peg_note: string
          peg_usd: number
          position: number
          symbol: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          name: string
          peg_note?: string
          peg_usd?: number
          position?: number
          symbol: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          name?: string
          peg_note?: string
          peg_usd?: number
          position?: number
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      ledger_wallets: {
        Row: {
          anchor: string | null
          claimed_at: string | null
          claimed_from: string | null
          created_at: string
          id: string
          kind: string
          label: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          anchor?: string | null
          claimed_at?: string | null
          claimed_from?: string | null
          created_at?: string
          id?: string
          kind?: string
          label?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          anchor?: string | null
          claimed_at?: string | null
          claimed_from?: string | null
          created_at?: string
          id?: string
          kind?: string
          label?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_wallets_claimed_from_fkey"
            columns: ["claimed_from"]
            isOneToOne: false
            referencedRelation: "ledger_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_attachment_opens: {
        Row: {
          attachment_id: string
          chapter_slug: string
          id: string
          opened_at: string
          user_id: string
        }
        Insert: {
          attachment_id: string
          chapter_slug: string
          id?: string
          opened_at?: string
          user_id: string
        }
        Update: {
          attachment_id?: string
          chapter_slug?: string
          id?: string
          opened_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_attachment_opens_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "manual_attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_attachments: {
        Row: {
          chapter_slug: string
          created_at: string
          created_by: string | null
          description: string | null
          external_url: string | null
          extracted_text: string | null
          id: string
          is_published: boolean
          kind: string
          layers: string[]
          mime_type: string | null
          original_date: string | null
          position: number
          significance: string | null
          size_bytes: number | null
          source_label: string | null
          storage_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          chapter_slug: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          external_url?: string | null
          extracted_text?: string | null
          id?: string
          is_published?: boolean
          kind: string
          layers?: string[]
          mime_type?: string | null
          original_date?: string | null
          position?: number
          significance?: string | null
          size_bytes?: number | null
          source_label?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          chapter_slug?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          external_url?: string | null
          extracted_text?: string | null
          id?: string
          is_published?: boolean
          kind?: string
          layers?: string[]
          mime_type?: string | null
          original_date?: string | null
          position?: number
          significance?: string | null
          size_bytes?: number | null
          source_label?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      manual_chapters: {
        Row: {
          body: string
          confidentiality: string
          created_at: string
          draft_status: string
          id: string
          number_label: string | null
          part: string
          position: number
          provenance_note: string | null
          pull_quote: string | null
          slug: string
          subtitle: string | null
          title: string
          truth: string
          updated_at: string
        }
        Insert: {
          body?: string
          confidentiality?: string
          created_at?: string
          draft_status?: string
          id?: string
          number_label?: string | null
          part: string
          position: number
          provenance_note?: string | null
          pull_quote?: string | null
          slug: string
          subtitle?: string | null
          title: string
          truth?: string
          updated_at?: string
        }
        Update: {
          body?: string
          confidentiality?: string
          created_at?: string
          draft_status?: string
          id?: string
          number_label?: string | null
          part?: string
          position?: number
          provenance_note?: string | null
          pull_quote?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          truth?: string
          updated_at?: string
        }
        Relationships: []
      }
      manual_edits: {
        Row: {
          chapter_slug: string
          edited_at: string
          edited_by: string
          field: string
          id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          chapter_slug: string
          edited_at?: string
          edited_by: string
          field: string
          id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          chapter_slug?: string
          edited_at?: string
          edited_by?: string
          field?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: []
      }
      manual_glossary: {
        Row: {
          created_at: string
          definition: string
          id: string
          see_also: string | null
          term: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition: string
          id?: string
          see_also?: string | null
          term: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition?: string
          id?: string
          see_also?: string | null
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      mission_tracks: {
        Row: {
          created_at: string
          id: string
          kind: string
          name: string
          note: string
          position: number
          purpose: string
          slug: string
          status: string
          truth_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          name: string
          note?: string
          position?: number
          purpose?: string
          slug: string
          status?: string
          truth_label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          name?: string
          note?: string
          position?: number
          purpose?: string
          slug?: string
          status?: string
          truth_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_costs: {
        Row: {
          act_amount: number
          category: string
          created_at: string
          est_amount: number
          id: string
          label: string
          note: string
          position: number
          recurring: boolean
          updated_at: string
        }
        Insert: {
          act_amount?: number
          category: string
          created_at?: string
          est_amount?: number
          id?: string
          label: string
          note?: string
          position?: number
          recurring?: boolean
          updated_at?: string
        }
        Update: {
          act_amount?: number
          category?: string
          created_at?: string
          est_amount?: number
          id?: string
          label?: string
          note?: string
          position?: number
          recurring?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      role_catalog: {
        Row: {
          axis: string
          certifiable: boolean
          created_at: string
          detail: string
          fee_jbk: number
          is_active: boolean
          key: string
          name: string
          position: number
          requestable: boolean
          summary: string
          updated_at: string
        }
        Insert: {
          axis?: string
          certifiable?: boolean
          created_at?: string
          detail?: string
          fee_jbk?: number
          is_active?: boolean
          key: string
          name: string
          position?: number
          requestable?: boolean
          summary?: string
          updated_at?: string
        }
        Update: {
          axis?: string
          certifiable?: boolean
          created_at?: string
          detail?: string
          fee_jbk?: number
          is_active?: boolean
          key?: string
          name?: string
          position?: number
          requestable?: boolean
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          fee_amount: number
          fee_paid_at: string | null
          id: string
          role_key: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          fee_amount?: number
          fee_paid_at?: string | null
          id?: string
          role_key: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          fee_amount?: number
          fee_paid_at?: string | null
          id?: string
          role_key?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_enrollments_role_key_fkey"
            columns: ["role_key"]
            isOneToOne: false
            referencedRelation: "role_catalog"
            referencedColumns: ["key"]
          },
        ]
      }
      role_modules: {
        Row: {
          body: string
          created_at: string
          id: string
          position: number
          quiz_answer: number
          quiz_options: string[]
          quiz_question: string
          role_key: string
          summary: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          position: number
          quiz_answer?: number
          quiz_options?: string[]
          quiz_question: string
          role_key: string
          summary?: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          position?: number
          quiz_answer?: number
          quiz_options?: string[]
          quiz_question?: string
          role_key?: string
          summary?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_modules_role_key_fkey"
            columns: ["role_key"]
            isOneToOne: false
            referencedRelation: "role_catalog"
            referencedColumns: ["key"]
          },
        ]
      }
      role_progress: {
        Row: {
          attempts: number
          created_at: string
          id: string
          module_id: string
          passed_at: string
          role_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          module_id: string
          passed_at?: string
          role_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          module_id?: string
          passed_at?: string
          role_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "role_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      room_demo_script: {
        Row: {
          created_at: string
          id: string
          layout: string | null
          lens: string | null
          position: number
          prompt: string
          scenario_slug: string | null
          speaking_note: string | null
          truth_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          layout?: string | null
          lens?: string | null
          position: number
          prompt: string
          scenario_slug?: string | null
          speaking_note?: string | null
          truth_label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          layout?: string | null
          lens?: string | null
          position?: number
          prompt?: string
          scenario_slug?: string | null
          speaking_note?: string | null
          truth_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_saved_views: {
        Row: {
          created_at: string
          id: string
          layout: string
          lens: string
          name: string
          owner_id: string
          query: Json
          shared: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          layout?: string
          lens?: string
          name: string
          owner_id: string
          query?: Json
          shared?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          layout?: string
          lens?: string
          name?: string
          owner_id?: string
          query?: Json
          shared?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      room_scenarios: {
        Row: {
          clock_steps: number
          created_at: string
          event_date: string
          id: string
          is_production: boolean
          name: string
          note: string
          peril: string
          position: number
          region: string
          slug: string
          updated_at: string
        }
        Insert: {
          clock_steps?: number
          created_at?: string
          event_date: string
          id?: string
          is_production?: boolean
          name: string
          note?: string
          peril: string
          position?: number
          region: string
          slug: string
          updated_at?: string
        }
        Update: {
          clock_steps?: number
          created_at?: string
          event_date?: string
          id?: string
          is_production?: boolean
          name?: string
          note?: string
          peril?: string
          position?: number
          region?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_signals: {
        Row: {
          clock_step: number
          confidence: number
          county: string
          created_at: string
          id: string
          observed_at: string
          provenance: string
          scenario_id: string
          state: string
          value: number
          variable_key: string
        }
        Insert: {
          clock_step?: number
          confidence?: number
          county: string
          created_at?: string
          id?: string
          observed_at?: string
          provenance?: string
          scenario_id: string
          state: string
          value?: number
          variable_key: string
        }
        Update: {
          clock_step?: number
          confidence?: number
          county?: string
          created_at?: string
          id?: string
          observed_at?: string
          provenance?: string
          scenario_id?: string
          state?: string
          value?: number
          variable_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_signals_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "room_scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_signals_variable_key_fkey"
            columns: ["variable_key"]
            isOneToOne: false
            referencedRelation: "room_variables"
            referencedColumns: ["key"]
          },
        ]
      }
      room_variables: {
        Row: {
          cadence: string
          confidentiality: string
          created_at: string
          definition: string
          headline: boolean
          id: string
          key: string
          name: string
          position: number
          source: string
          stakeholder: string
          truth_label: string
          unit: string
          updated_at: string
        }
        Insert: {
          cadence?: string
          confidentiality?: string
          created_at?: string
          definition?: string
          headline?: boolean
          id?: string
          key: string
          name: string
          position?: number
          source?: string
          stakeholder: string
          truth_label?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          cadence?: string
          confidentiality?: string
          created_at?: string
          definition?: string
          headline?: boolean
          id?: string
          key?: string
          name?: string
          position?: number
          source?: string
          stakeholder?: string
          truth_label?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_ledger: {
        Row: {
          act_cost: number
          act_hours: number
          actor: string
          created_at: string
          created_by: string | null
          est_cost: number
          est_hours: number
          id: string
          note: string
          occurred_on: string
          outcome: string
          rework: number
          sprint_label: string | null
          task_class: string
          title: string
          updated_at: string
        }
        Insert: {
          act_cost?: number
          act_hours?: number
          actor?: string
          created_at?: string
          created_by?: string | null
          est_cost?: number
          est_hours?: number
          id?: string
          note?: string
          occurred_on?: string
          outcome?: string
          rework?: number
          sprint_label?: string | null
          task_class?: string
          title: string
          updated_at?: string
        }
        Update: {
          act_cost?: number
          act_hours?: number
          actor?: string
          created_at?: string
          created_by?: string | null
          est_cost?: number
          est_hours?: number
          id?: string
          note?: string
          occurred_on?: string
          outcome?: string
          rework?: number
          sprint_label?: string | null
          task_class?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_attendee_view: { Args: { _token: string }; Returns: Json }
      get_ticket_view: { Args: { _credential: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_insider_invitation: { Args: { _token: string }; Returns: Json }
      update_attendee_details: {
        Args: {
          _dietary: string
          _hotel_needed: boolean
          _notes: string
          _plus_ones: number
          _token: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "founder_admin"
        | "counsel"
        | "rrca_exec"
        | "investor_prospect"
        | "sponsor_prospect"
        | "strategic_partner"
        | "specialist_advisor"
        | "system_auditor"
        | "qualified_insider"
        | "interested_user"
        | "industry_observer"
        | "venture_tech"
        | "systems_tech"
        | "legal_tech"
        | "insure_tech"
        | "fin_tech"
        | "construction_management"
        | "business_development"
        | "isr"
        | "verified_member"
        | "lc"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "founder_admin",
        "counsel",
        "rrca_exec",
        "investor_prospect",
        "sponsor_prospect",
        "strategic_partner",
        "specialist_advisor",
        "system_auditor",
        "qualified_insider",
        "interested_user",
        "industry_observer",
        "venture_tech",
        "systems_tech",
        "legal_tech",
        "insure_tech",
        "fin_tech",
        "construction_management",
        "business_development",
        "isr",
        "verified_member",
        "lc",
      ],
    },
  },
} as const
