package com.taxzone.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.ExitToApp
import androidx.compose.material.icons.automirrored.rounded.Help
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taxzone.app.ui.theme.*

@Composable
fun ProfileScreen(onBack: () -> Unit) {
    Scaffold(
        topBar = {
            Surface(shadowElevation = 2.dp) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .statusBarsPadding()
                        .padding(horizontal = 4.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                    Text(
                        "Profile",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Gray900)
                    )
                }
            }
        },
        containerColor = Gray50
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp)
        ) {
            // Hero Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .clip(CircleShape)
                                .background(Brush.linearGradient(listOf(BrandPrimary, BrandIndigo))),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("RK", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text("Rajesh Kumar", style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold))
                        Text("Individual Client", style = MaterialTheme.typography.bodyMedium.copy(color = Gray500))
                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(color = BrandSuccessLight, shape = RoundedCornerShape(4.dp)) {
                            Text("Verified", modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp), style = MaterialTheme.typography.labelSmall.copy(color = BrandSuccess, fontWeight = FontWeight.Bold))
                        }
                    }
                }
            }

            // Menu Items
            item {
                ProfileMenuItem(Icons.Rounded.Person, "Personal Information", "Name, PAN, Aadhar details")
                ProfileMenuItem(Icons.Rounded.CreditCard, "Tax Details", "PAN, GSTIN, IT credentials")
                ProfileMenuItem(Icons.Rounded.History, "Filing History", "All past tax filings")
                Spacer(modifier = Modifier.height(16.dp))
                ProfileMenuItem(Icons.Rounded.Notifications, "Notifications", "Email, SMS, push alerts")
                ProfileMenuItem(Icons.Rounded.Shield, "Privacy & Security", "Password, 2FA, sessions")
                Spacer(modifier = Modifier.height(16.dp))
                ProfileMenuItem(Icons.AutoMirrored.Rounded.Help, "Help Center", "FAQs, chat support")
                ProfileMenuItem(Icons.AutoMirrored.Rounded.ExitToApp, "Sign Out", "Logout from your account", textColor = BrandDanger)
            }

            item {
                Spacer(modifier = Modifier.height(32.dp))
                Text("TaxZone v1.0.0", modifier = Modifier.fillMaxWidth(), textAlign = androidx.compose.ui.text.style.TextAlign.Center, style = MaterialTheme.typography.labelSmall.copy(color = Gray400))
            }
        }
    }
}

@Composable
fun ProfileMenuItem(icon: ImageVector, title: String, desc: String, textColor: Color = Gray900) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).clickable { },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier.size(40.dp).clip(RoundedCornerShape(8.dp)).background(Gray100),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = if (textColor == BrandDanger) BrandDanger else Gray600)
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = textColor))
                Text(desc, style = MaterialTheme.typography.labelSmall.copy(color = Gray400))
            }
            Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = Gray300)
        }
    }
}
