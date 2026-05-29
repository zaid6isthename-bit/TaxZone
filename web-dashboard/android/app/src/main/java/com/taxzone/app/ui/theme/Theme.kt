package com.taxzone.app.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val TaxZoneColorScheme = lightColorScheme(
    primary            = BrandPrimary,
    onPrimary          = Color.White,
    primaryContainer   = BrandPrimaryLight,
    onPrimaryContainer = BrandPrimary,
    secondary          = BrandIndigo,
    onSecondary        = Color.White,
    background         = Color(0xFFF9FAFB),
    surface            = Color.White,
    onBackground       = Gray900,
    onSurface          = Gray800,
    outline            = Gray300,
    error              = SemanticDanger,
)

@Composable
fun TaxZoneTheme(
    content: @Composable () -> Unit
) {
    // Light ONLY, dark mode disabled
    val colorScheme = TaxZoneColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = true
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = TaxZoneTypography,
        shapes     = TaxZoneShapes,
        content    = content
    )
}
