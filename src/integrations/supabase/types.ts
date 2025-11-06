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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          hours_worked: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          hours_worked?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          hours_worked?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cash_flow_schedule: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          flow_date: string
          flow_type: string
          id: string
          is_confirmed: boolean | null
          source_id: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          flow_date: string
          flow_type: string
          id?: string
          is_confirmed?: boolean | null
          source_id?: string | null
          source_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          flow_date?: string
          flow_type?: string
          id?: string
          is_confirmed?: boolean | null
          source_id?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          account_manager: string | null
          client_type: string | null
          contact_person: string | null
          created_at: string | null
          credit_terms: number | null
          email: string | null
          id: string
          industry: string | null
          last_order_date: string | null
          name: string
          outstanding_balance: number | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          total_orders: number | null
          updated_at: string | null
        }
        Insert: {
          account_manager?: string | null
          client_type?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_terms?: number | null
          email?: string | null
          id?: string
          industry?: string | null
          last_order_date?: string | null
          name: string
          outstanding_balance?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Update: {
          account_manager?: string | null
          client_type?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_terms?: number | null
          email?: string | null
          id?: string
          industry?: string | null
          last_order_date?: string | null
          name?: string
          outstanding_balance?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          business_hours_end: string | null
          business_hours_start: string | null
          contact_email: string | null
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_hours_end?: string | null
          business_hours_start?: string | null
          contact_email?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_hours_end?: string | null
          business_hours_start?: string | null
          contact_email?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deduction_types: {
        Row: {
          created_at: string | null
          default_amount: number | null
          default_percentage: number | null
          description: string | null
          id: string
          is_mandatory: boolean | null
          is_percentage: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          default_amount?: number | null
          default_percentage?: number | null
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          is_percentage?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          default_amount?: number | null
          default_percentage?: number | null
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          is_percentage?: boolean | null
          name?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          client_name: string
          contact: string | null
          created_at: string | null
          delivery_date: string
          delivery_number: string
          delivery_time: string | null
          destination: string | null
          driver: string | null
          driver_id: string | null
          id: string
          method: Database["public"]["Enums"]["delivery_method"]
          mo_id: string | null
          order_id: string
          product: string
          quantity: number
          status: Database["public"]["Enums"]["delivery_status"] | null
          updated_at: string | null
          vehicle: string | null
          vehicle_id: string | null
        }
        Insert: {
          client_name: string
          contact?: string | null
          created_at?: string | null
          delivery_date: string
          delivery_number: string
          delivery_time?: string | null
          destination?: string | null
          driver?: string | null
          driver_id?: string | null
          id?: string
          method: Database["public"]["Enums"]["delivery_method"]
          mo_id?: string | null
          order_id: string
          product: string
          quantity: number
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string | null
          vehicle?: string | null
          vehicle_id?: string | null
        }
        Update: {
          client_name?: string
          contact?: string | null
          created_at?: string | null
          delivery_date?: string
          delivery_number?: string
          delivery_time?: string | null
          destination?: string | null
          driver?: string | null
          driver_id?: string | null
          id?: string
          method?: Database["public"]["Enums"]["delivery_method"]
          mo_id?: string | null
          order_id?: string
          product?: string
          quantity?: number
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string | null
          vehicle?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_mo_id_fkey"
            columns: ["mo_id"]
            isOneToOne: false
            referencedRelation: "manufacturing_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_deductions: {
        Row: {
          amount: number | null
          created_at: string | null
          deduction_type_id: string | null
          effective_from: string | null
          effective_until: string | null
          employee_id: string | null
          id: string
          is_active: boolean | null
          percentage: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          deduction_type_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          deduction_type_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_deductions_deduction_type_id_fkey"
            columns: ["deduction_type_id"]
            isOneToOne: false
            referencedRelation: "deduction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_deductions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_loans: {
        Row: {
          created_at: string | null
          employee_id: string | null
          end_date: string | null
          id: string
          loan_type: string
          monthly_payment: number
          notes: string | null
          original_amount: number
          outstanding_balance: number
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          loan_type: string
          monthly_payment?: number
          notes?: string | null
          original_amount: number
          outstanding_balance?: number
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          loan_type?: string
          monthly_payment?: number
          notes?: string | null
          original_amount?: number
          outstanding_balance?: number
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_loans_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          atg_clock_number: string | null
          bank_account_number: string | null
          bank_name: string | null
          bonus_eligible: boolean | null
          comments: string | null
          created_at: string | null
          department: string | null
          email: string | null
          emergency_contact: string | null
          employee_number: string
          employee_type: string | null
          employment_type: string | null
          factory: string
          first_name: string | null
          hire_date: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          last_name: string | null
          lateness_penalty_rate: number | null
          overtime_rate_multiplier: number | null
          payment_method: string | null
          phone: string | null
          position: string | null
          salary_annual: number | null
          tax_number: string | null
          union_member: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          atg_clock_number?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bonus_eligible?: boolean | null
          comments?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          emergency_contact?: string | null
          employee_number: string
          employee_type?: string | null
          employment_type?: string | null
          factory?: string
          first_name?: string | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          lateness_penalty_rate?: number | null
          overtime_rate_multiplier?: number | null
          payment_method?: string | null
          phone?: string | null
          position?: string | null
          salary_annual?: number | null
          tax_number?: string | null
          union_member?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          atg_clock_number?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bonus_eligible?: boolean | null
          comments?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          emergency_contact?: string | null
          employee_number?: string
          employee_type?: string | null
          employment_type?: string | null
          factory?: string
          first_name?: string | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          lateness_penalty_rate?: number | null
          overtime_rate_multiplier?: number | null
          payment_method?: string | null
          phone?: string | null
          position?: string | null
          salary_annual?: number | null
          tax_number?: string | null
          union_member?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          bill_number: string | null
          category: string
          created_at: string
          created_by: string
          description: string
          due_date: string
          expense_number: string
          gl_code: string | null
          id: string
          paid_amount: number | null
          paid_date: string | null
          payment_status: string
          pdf_url: string | null
          supplier_name: string
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          bill_number?: string | null
          category: string
          created_at?: string
          created_by: string
          description: string
          due_date: string
          expense_number: string
          gl_code?: string | null
          id?: string
          paid_amount?: number | null
          paid_date?: string | null
          payment_status?: string
          pdf_url?: string | null
          supplier_name: string
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount?: number
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          bill_number?: string | null
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          due_date?: string
          expense_number?: string
          gl_code?: string | null
          id?: string
          paid_amount?: number | null
          paid_date?: string | null
          payment_status?: string
          pdf_url?: string | null
          supplier_name?: string
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      factories: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          machine_count: number | null
          name: string
          operator_count: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          machine_count?: number | null
          name: string
          operator_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          machine_count?: number | null
          name?: string
          operator_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_status: {
        Row: {
          config_data: Json | null
          created_at: string
          error_message: string | null
          id: string
          integration_name: string
          last_sync_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          config_data?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          integration_name: string
          last_sync_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          config_data?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          integration_name?: string
          last_sync_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          created_by: string
          discount_amount: number | null
          due_date: string | null
          freight_amount: number | null
          id: string
          invoice_number: string
          issue_date: string | null
          line_items: Json
          notes: string | null
          order_id: string
          paid_at: string | null
          payment_terms: number | null
          pdf_url: string | null
          sent_at: string | null
          status: string
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          created_by: string
          discount_amount?: number | null
          due_date?: string | null
          freight_amount?: number | null
          id?: string
          invoice_number: string
          issue_date?: string | null
          line_items: Json
          notes?: string | null
          order_id: string
          paid_at?: string | null
          payment_terms?: number | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          created_by?: string
          discount_amount?: number | null
          due_date?: string | null
          freight_amount?: number | null
          id?: string
          invoice_number?: string
          issue_date?: string | null
          line_items?: Json
          notes?: string | null
          order_id?: string
          paid_at?: string | null
          payment_terms?: number | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          leave_type_id: string | null
          remaining_days: number | null
          total_days: number | null
          updated_at: string | null
          used_days: number | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          leave_type_id?: string | null
          remaining_days?: number | null
          total_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          leave_type_id?: string | null
          remaining_days?: number | null
          total_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          days_requested: number
          employee_id: string | null
          end_date: string
          id: string
          leave_type_id: string | null
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          days_requested: number
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type_id?: string | null
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          days_requested?: number
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type_id?: string | null
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_paid: boolean | null
          max_days_per_year: number | null
          name: string
          requires_approval: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean | null
          max_days_per_year?: number | null
          name: string
          requires_approval?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean | null
          max_days_per_year?: number | null
          name?: string
          requires_approval?: boolean | null
        }
        Relationships: []
      }
      machine_check: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          machine_id: string | null
          notes: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          machine_id?: string | null
          notes?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          machine_id?: string | null
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_check_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          created_at: string | null
          factory_id: string | null
          id: string
          name: string
          production_target: number | null
          status: string | null
          target_unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          factory_id?: string | null
          id?: string
          name: string
          production_target?: number | null
          status?: string | null
          target_unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          factory_id?: string | null
          id?: string
          name?: string
          production_target?: number | null
          status?: string | null
          target_unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturing_orders: {
        Row: {
          artwork_url: string | null
          client_id: string
          created_at: string | null
          delivery_target_date: string | null
          due_date: string
          id: string
          internal_approval: string | null
          material_details: string | null
          mo_number: string
          order_id: string
          packaging_requirements: string | null
          print_specs: string | null
          product: string
          quantity: number
          scheduled_end_date: string | null
          scheduled_start_date: string | null
          status: Database["public"]["Enums"]["mo_status"] | null
          updated_at: string | null
        }
        Insert: {
          artwork_url?: string | null
          client_id: string
          created_at?: string | null
          delivery_target_date?: string | null
          due_date: string
          id?: string
          internal_approval?: string | null
          material_details?: string | null
          mo_number: string
          order_id: string
          packaging_requirements?: string | null
          print_specs?: string | null
          product: string
          quantity: number
          scheduled_end_date?: string | null
          scheduled_start_date?: string | null
          status?: Database["public"]["Enums"]["mo_status"] | null
          updated_at?: string | null
        }
        Update: {
          artwork_url?: string | null
          client_id?: string
          created_at?: string | null
          delivery_target_date?: string | null
          due_date?: string
          id?: string
          internal_approval?: string | null
          material_details?: string | null
          mo_number?: string
          order_id?: string
          packaging_requirements?: string | null
          print_specs?: string | null
          product?: string
          quantity?: number
          scheduled_end_date?: string | null
          scheduled_start_date?: string | null
          status?: Database["public"]["Enums"]["mo_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manufacturing_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manufacturing_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string
          delivery_date: string
          id: string
          order_date: string | null
          order_number: string
          order_value: number
          product: string
          quantity: number
          quote_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by: string
          delivery_date: string
          id?: string
          order_date?: string | null
          order_number: string
          order_value: number
          product: string
          quantity: number
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string
          delivery_date?: string
          id?: string
          order_date?: string | null
          order_number?: string
          order_value?: number
          product?: string
          quantity?: number
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_batches: {
        Row: {
          bank_export_url: string | null
          batch_number: string
          created_at: string
          created_by: string
          expense_ids: string[]
          id: string
          payment_date: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          bank_export_url?: string | null
          batch_number: string
          created_at?: string
          created_by: string
          expense_ids: string[]
          id?: string
          payment_date: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          bank_export_url?: string | null
          batch_number?: string
          created_at?: string
          created_by?: string
          expense_ids?: string[]
          id?: string
          payment_date?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      payroll_bonuses: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bonus_amount: number | null
          bonus_reason: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          payroll_period_id: string | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bonus_amount?: number | null
          bonus_reason?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          payroll_period_id?: string | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bonus_amount?: number | null
          bonus_reason?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          payroll_period_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_bonuses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_bonuses_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          pay_date: string
          period_name: string
          period_type: string | null
          start_date: string
          status: string | null
          total_deductions: number | null
          total_employees: number | null
          total_gross_pay: number | null
          total_net_pay: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          pay_date: string
          period_name: string
          period_type?: string | null
          start_date: string
          status?: string | null
          total_deductions?: number | null
          total_employees?: number | null
          total_gross_pay?: number | null
          total_net_pay?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          pay_date?: string
          period_name?: string
          period_type?: string | null
          start_date?: string
          status?: string | null
          total_deductions?: number | null
          total_employees?: number | null
          total_gross_pay?: number | null
          total_net_pay?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payroll_records: {
        Row: {
          bonus_pay: number | null
          created_at: string | null
          employee_id: string | null
          gross_pay: number | null
          id: string
          leave_pay: number | null
          net_pay: number | null
          other_deductions: number | null
          overtime_hours: number | null
          overtime_pay: number | null
          payment_date: string | null
          payment_status: string | null
          payroll_period_id: string | null
          regular_hours: number | null
          regular_pay: number | null
          tax_deduction: number | null
          total_deductions: number | null
          updated_at: string | null
        }
        Insert: {
          bonus_pay?: number | null
          created_at?: string | null
          employee_id?: string | null
          gross_pay?: number | null
          id?: string
          leave_pay?: number | null
          net_pay?: number | null
          other_deductions?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          payment_date?: string | null
          payment_status?: string | null
          payroll_period_id?: string | null
          regular_hours?: number | null
          regular_pay?: number | null
          tax_deduction?: number | null
          total_deductions?: number | null
          updated_at?: string | null
        }
        Update: {
          bonus_pay?: number | null
          created_at?: string | null
          employee_id?: string | null
          gross_pay?: number | null
          id?: string
          leave_pay?: number | null
          net_pay?: number | null
          other_deductions?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          payment_date?: string | null
          payment_status?: string | null
          payroll_period_id?: string | null
          regular_hours?: number | null
          regular_pay?: number | null
          tax_deduction?: number | null
          total_deductions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      production_records: {
        Row: {
          created_at: string | null
          efficiency_percentage: number | null
          id: string
          machine_id: string | null
          quantity: number | null
          recorded_at: string | null
          target: number | null
        }
        Insert: {
          created_at?: string | null
          efficiency_percentage?: number | null
          id?: string
          machine_id?: string | null
          quantity?: number | null
          recorded_at?: string | null
          target?: number | null
        }
        Update: {
          created_at?: string | null
          efficiency_percentage?: number | null
          id?: string
          machine_id?: string | null
          quantity?: number | null
          recorded_at?: string | null
          target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_records_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      qc_flags: {
        Row: {
          created_at: string | null
          date: string | null
          defects: string | null
          id: string
          machine_id: string | null
          result: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          defects?: string | null
          id?: string
          machine_id?: string | null
          result?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          defects?: string | null
          id?: string
          machine_id?: string | null
          result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qc_flags_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string
          converted_order_id: string | null
          created_at: string | null
          created_by: string
          expiry_date: string
          id: string
          lead_time_days: number
          price_per_unit: number
          product: string
          quantity: number
          quote_number: string
          status: Database["public"]["Enums"]["quote_status"] | null
          total_value: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          converted_order_id?: string | null
          created_at?: string | null
          created_by: string
          expiry_date: string
          id?: string
          lead_time_days: number
          price_per_unit: number
          product: string
          quantity: number
          quote_number: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          total_value: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          converted_order_id?: string | null
          created_at?: string | null
          created_by?: string
          expiry_date?: string
          id?: string
          lead_time_days?: number
          price_per_unit?: number
          product?: string
          quantity?: number
          quote_number?: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          total_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotes_converted_order"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      receivables: {
        Row: {
          client_id: string
          created_at: string
          days_overdue: number | null
          due_date: string
          id: string
          invoice_id: string
          invoice_number: string
          last_reminder_sent: string | null
          outstanding_amount: number
          paid_amount: number | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          days_overdue?: number | null
          due_date: string
          id?: string
          invoice_id: string
          invoice_number: string
          last_reminder_sent?: string | null
          outstanding_amount: number
          paid_amount?: number | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          days_overdue?: number | null
          due_date?: string
          id?: string
          invoice_id?: string
          invoice_number?: string
          last_reminder_sent?: string | null
          outstanding_amount?: number
          paid_amount?: number | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receivables_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivables_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          is_active: boolean | null
          name: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_active?: boolean | null
          name: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_logs: {
        Row: {
          created_at: string | null
          date: string | null
          employee_name: string | null
          hours: number | null
          id: string
          shift: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          employee_name?: string | null
          hours?: number | null
          id?: string
          shift?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          employee_name?: string | null
          hours?: number | null
          id?: string
          shift?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      time_records: {
        Row: {
          atg_clock_number: string | null
          break_end: string | null
          break_start: string | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          imported_at: string | null
          late_minutes: number | null
          lateness_penalty: number | null
          overtime_hours: number | null
          total_hours: number | null
          updated_at: string | null
        }
        Insert: {
          atg_clock_number?: string | null
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          imported_at?: string | null
          late_minutes?: number | null
          lateness_penalty?: number | null
          overtime_hours?: number | null
          total_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          atg_clock_number?: string | null
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          imported_at?: string | null
          late_minutes?: number | null
          lateness_penalty?: number | null
          overtime_hours?: number | null
          total_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_status: {
        Row: {
          error_message: string | null
          file_name: string
          file_url: string | null
          flag_reason: string | null
          flagged: boolean | null
          id: string
          processed_at: string | null
          report_type: string
          status: string | null
          uploaded_at: string | null
        }
        Insert: {
          error_message?: string | null
          file_name: string
          file_url?: string | null
          flag_reason?: string | null
          flagged?: boolean | null
          id?: string
          processed_at?: string | null
          report_type: string
          status?: string | null
          uploaded_at?: string | null
        }
        Update: {
          error_message?: string | null
          file_name?: string
          file_url?: string | null
          flag_reason?: string | null
          flagged?: boolean | null
          id?: string
          processed_at?: string | null
          report_type?: string
          status?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          assigned_driver_id: string | null
          capacity_kg: number | null
          created_at: string
          id: string
          license_plate: string | null
          make: string | null
          model: string | null
          status: string
          updated_at: string
          vehicle_number: string
          vehicle_type: string
          year: number | null
        }
        Insert: {
          assigned_driver_id?: string | null
          capacity_kg?: number | null
          created_at?: string
          id?: string
          license_plate?: string | null
          make?: string | null
          model?: string | null
          status?: string
          updated_at?: string
          vehicle_number: string
          vehicle_type: string
          year?: number | null
        }
        Update: {
          assigned_driver_id?: string | null
          capacity_kg?: number | null
          created_at?: string
          id?: string
          license_plate?: string | null
          make?: string | null
          model?: string | null
          status?: string
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_logs: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          material_type: string | null
          waste_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          material_type?: string | null
          waste_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          material_type?: string | null
          waste_percentage?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_payroll_for_period: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          employee_id: string
          employee_name: string
          gross_pay: number
          net_pay: number
          overtime_hours: number
          overtime_pay: number
          regular_hours: number
          regular_pay: number
          total_deductions: number
        }[]
      }
      create_next_payroll_period: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_batch_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_delivery_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_expense_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_mo_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      client_status: "Active" | "Paused" | "Blacklisted"
      delivery_method: "Internal Fleet" | "Courier" | "3rd Party"
      delivery_status: "Scheduled" | "En Route" | "Delivered"
      mo_status:
        | "In Queue"
        | "Scheduled"
        | "In Production"
        | "Completed"
        | "On Hold"
      order_status: "New" | "Confirmed" | "Cancelled" | "Delivered" | "On Hold"
      quote_status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      client_status: ["Active", "Paused", "Blacklisted"],
      delivery_method: ["Internal Fleet", "Courier", "3rd Party"],
      delivery_status: ["Scheduled", "En Route", "Delivered"],
      mo_status: [
        "In Queue",
        "Scheduled",
        "In Production",
        "Completed",
        "On Hold",
      ],
      order_status: ["New", "Confirmed", "Cancelled", "Delivered", "On Hold"],
      quote_status: ["Draft", "Sent", "Accepted", "Rejected", "Expired"],
    },
  },
} as const
