package com.taxzone.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.taxzone.app.ui.screens.*

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "welcome") {
        composable("welcome") {
            WelcomeScreen(
                onNavigateToHome = { navController.navigate("client_home") },
                onNavigateToPortal = { navController.navigate("portal") }
            )
        }
        composable("client_home") {
            ClientHomeScreen(
                onNavigateToDocuments = { navController.navigate("documents") },
                onNavigateToFiling = { navController.navigate("filing_detail") },
                onNavigateToNotifications = { navController.navigate("notifications") },
                onNavigateToProfile = { navController.navigate("profile") },
                onBack = { navController.popBackStack() }
            )
        }
        composable("documents") {
            DocumentsScreen(onBack = { navController.popBackStack() })
        }
        composable("filing_detail") {
            FilingDetailScreen(onBack = { navController.popBackStack() })
        }
        composable("notifications") {
            NotificationsScreen(onBack = { navController.popBackStack() })
        }
        composable("profile") {
            ProfileScreen(onBack = { navController.popBackStack() })
        }
        composable("portal") {
            PortalScreen(onBack = { navController.popBackStack() })
        }
    }
}
