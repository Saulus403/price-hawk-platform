export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bairros: {
        Row: {
          cidade_id: string
          id: string
          nome: string
        }
        Insert: {
          cidade_id: string
          id?: string
          nome: string
        }
        Update: {
          cidade_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "bairros_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
        ]
      }
      cidades: {
        Row: {
          estado: string
          id: string
          nome: string
        }
        Insert: {
          estado: string
          id?: string
          nome: string
        }
        Update: {
          estado?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "cidades_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["sigla"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string | null
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      estados: {
        Row: {
          nome: string
          sigla: string
        }
        Insert: {
          nome: string
          sigla: string
        }
        Update: {
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
      marcas: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: []
      }
      mercados: {
        Row: {
          bairro: string | null
          cidade: string | null
          created_at: string | null
          empresa_id: string | null
          estado: string | null
          id: string
          nome: string
        }
        Insert: {
          bairro?: string | null
          cidade?: string | null
          created_at?: string | null
          empresa_id?: string | null
          estado?: string | null
          id?: string
          nome: string
        }
        Update: {
          bairro?: string | null
          cidade?: string | null
          created_at?: string | null
          empresa_id?: string | null
          estado?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      precos_coletados: {
        Row: {
          alimentador_id: string
          created_at: string | null
          data_atualizacao: string | null
          empresa_id: string
          id: string
          mercado_id: string | null
          mercado_nome: string | null
          notas: string | null
          origem: string
          produto_id: string
          valor: number
        }
        Insert: {
          alimentador_id: string
          created_at?: string | null
          data_atualizacao?: string | null
          empresa_id: string
          id?: string
          mercado_id?: string | null
          mercado_nome?: string | null
          notas?: string | null
          origem?: string
          produto_id: string
          valor: number
        }
        Update: {
          alimentador_id?: string
          created_at?: string | null
          data_atualizacao?: string | null
          empresa_id?: string
          id?: string
          mercado_id?: string | null
          mercado_nome?: string | null
          notas?: string | null
          origem?: string
          produto_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "precos_coletados_alimentador_id_fkey"
            columns: ["alimentador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precos_coletados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precos_coletados_mercado_id_fkey"
            columns: ["mercado_id"]
            isOneToOne: false
            referencedRelation: "mercados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precos_coletados_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string
          brand: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          barcode: string
          brand?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          barcode?: string
          brand?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          marca_id: string
          nome: string
          revendedora_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          marca_id: string
          nome: string
          revendedora_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          marca_id?: string
          nome?: string
          revendedora_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_revendedora_id_fkey"
            columns: ["revendedora_id"]
            isOneToOne: false
            referencedRelation: "revendedoras"
            referencedColumns: ["id"]
          },
        ]
      }
      revendedoras: {
        Row: {
          atualizado_em: string | null
          bairro_id: string
          cidade_id: string
          criado_em: string | null
          descricao: string | null
          estado: string
          id: string
          instagram: string | null
          nome: string
          telefone: string | null
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          atualizado_em?: string | null
          bairro_id: string
          cidade_id: string
          criado_em?: string | null
          descricao?: string | null
          estado: string
          id?: string
          instagram?: string | null
          nome: string
          telefone?: string | null
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          atualizado_em?: string | null
          bairro_id?: string
          cidade_id?: string
          criado_em?: string | null
          descricao?: string | null
          estado?: string
          id?: string
          instagram?: string | null
          nome?: string
          telefone?: string | null
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "revendedoras_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revendedoras_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revendedoras_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["sigla"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id: string
          nome: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
