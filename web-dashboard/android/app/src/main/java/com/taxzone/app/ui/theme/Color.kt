package com.taxzone.app.ui.theme

import androidx.compose.ui.graphics.Color

// All values mirror globals.css exactly
val BrandPrimary       = Color(0xFF1A4FBA)
val BrandPrimaryLight  = Color(0xFFEBF1FF)
val BrandPrimaryDark   = Color(0xFF0F2E6E)
val GradientStart      = Color(0xFF4F46E5)
val GradientEnd        = Color(0xFF1A4FBA)

val SemanticSuccess    = Color(0xFF16A34A)
val SemanticSuccessLight = Color(0xFFDCFCE7)
val SemanticWarning    = Color(0xFFD97706)
val SemanticWarningLight = Color(0xFFFEF3C7)
val SemanticDanger     = Color(0xFFDC2626)
val SemanticDangerLight  = Color(0xFFFEE2E2)
val SemanticInfo       = Color(0xFF0284C7)
val SemanticInfoLight    = Color(0xFFE0F2FE)

val Gray50  = Color(0xFFF9FAFB)
val Gray100 = Color(0xFFF3F4F6)
val Gray200 = Color(0xFFE5E7EB)
val Gray300 = Color(0xFFD1D5DB)
val Gray400 = Color(0xFF9CA3AF)
val Gray500 = Color(0xFF6B7280)
val Gray600 = Color(0xFF4B5563)
val Gray700 = Color(0xFF374151)
val Gray800 = Color(0xFF1F2937)
val Gray900 = Color(0xFF111827)

// Legacy mappings used by existing components
val BrandIndigo = Color(0xFF5B4CF5)
val BrandSuccess = SemanticSuccess
val BrandSuccessLight = SemanticSuccessLight
val BrandWarning = SemanticWarning
val BrandWarningLight = SemanticWarningLight
val BrandDanger = SemanticDanger
val BrandDangerLight = SemanticDangerLight
val BrandInfo = SemanticInfo
val BrandInfoLight = SemanticInfoLight

// Material 3 Color Mapping
val md_theme_light_primary = BrandPrimary
val md_theme_light_onPrimary = Color(0xFFFFFFFF)
val md_theme_light_primaryContainer = BrandPrimaryLight
val md_theme_light_onPrimaryContainer = BrandPrimary
val md_theme_light_secondary = BrandIndigo
val md_theme_light_onSecondary = Color(0xFFFFFFFF)
val md_theme_light_secondaryContainer = Color(0xFFE0E7FF)
val md_theme_light_onSecondaryContainer = BrandIndigo
val md_theme_light_tertiary = BrandInfo
val md_theme_light_onTertiary = Color(0xFFFFFFFF)
val md_theme_light_tertiaryContainer = BrandInfoLight
val md_theme_light_onTertiaryContainer = BrandInfo
val md_theme_light_error = BrandDanger
val md_theme_light_errorContainer = BrandDangerLight
val md_theme_light_onError = Color(0xFFFFFFFF)
val md_theme_light_onErrorContainer = BrandDanger
val md_theme_light_background = Gray50
val md_theme_light_onBackground = Gray900
val md_theme_light_surface = Color(0xFFFFFFFF)
val md_theme_light_onSurface = Gray900
val md_theme_light_surfaceVariant = Gray100
val md_theme_light_onSurfaceVariant = Gray700
val md_theme_light_outline = Gray200
val md_theme_light_inverseOnSurface = Gray50
val md_theme_light_inverseSurface = Gray900
val md_theme_light_inversePrimary = Color(0xFF94A3B8)
val md_theme_light_surfaceTint = BrandPrimary
val md_theme_light_outlineVariant = Gray100
val md_theme_light_scrim = Color(0xFF000000)
