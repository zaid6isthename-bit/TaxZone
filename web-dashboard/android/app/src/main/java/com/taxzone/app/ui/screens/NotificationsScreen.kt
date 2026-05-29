package com.taxzone.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taxzone.app.ui.theme.*

data class Notification(
    val title: String,
    val desc: String,
    val time: String,
    val icon: ImageVector,
    val color: Color,
    val bgColor: Color,
    val unread: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(onBack: () -> Unit) {
    val notifications = listOf(
        Notification("Documents Requested", "Your CA has requested 3 documents for GSTR-1 October filing.", "2 hours ago", Icons.Rounded.CloudUpload, BrandWarning, BrandWarningLight, true),
        Notification("ITR Filed Successfully", "Your Income Tax Return for FY 2023-24 has been submitted.", "Yesterday", Icons.Rounded.CheckCircle, BrandSuccess, BrandSuccessLight, true),
        Notification("Deadline Approaching", "GSTR-3B for November 2024 is due in 5 days.", "2 days ago", Icons.Rounded.ErrorOutline, BrandDanger, BrandDangerLight, false),
        Notification("Filing Under Review", "GSTR-1 for October 2024 has been submitted and is under review.", "3 days ago", Icons.Rounded.Description, BrandPrimary, BrandPrimaryLight, false)
    )

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
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = onBack) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                        }
                        Text(
                            "Notifications",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Gray900)
                        )
                    }
                    TextButton(onClick = {}) {
                        Text("Mark all read", color = BrandPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        },
        containerColor = Gray50
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(notifications) { n ->
                NotificationItem(n)
            }
        }
    }
}

@Composable
fun NotificationItem(n: Notification) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (n.unread) Color.White else Gray100.copy(alpha = 0.5f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = if (n.unread) 2.dp else 0.dp),
        border = if (n.unread) androidx.compose.foundation.BorderStroke(1.dp, BrandPrimary.copy(alpha = 0.1f)) else null
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(n.bgColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(n.icon, contentDescription = null, tint = n.color, modifier = Modifier.size(20.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(n.title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Gray900))
                    if (n.unread) {
                        Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(BrandPrimary))
                    }
                }
                Text(n.desc, style = MaterialTheme.typography.bodySmall.copy(color = Gray500), modifier = Modifier.padding(vertical = 4.dp))
                Text(n.time, style = MaterialTheme.typography.labelSmall.copy(color = Gray400, fontWeight = FontWeight.Bold))
            }
        }
    }
}
