package com.taxzone.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.taxzone.app.ui.navigation.AppNavigation
import com.taxzone.app.ui.theme.TaxZoneTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TaxZoneTheme {
                AppNavigation()
            }
        }
    }
}
