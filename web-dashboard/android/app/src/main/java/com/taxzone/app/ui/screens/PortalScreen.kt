package com.taxzone.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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

data class Stat(
    val title: String,
    val value: String,
    val icon: ImageVector,
    val color: Color,
    val bgColor: Color
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PortalScreen(onBack: () -> Unit) {
    val stats = listOf(
        Stat("Total Clients", "124", Icons.Rounded.People, BrandPrimary, BrandPrimaryLight),
        Stat("Filings Done", "45", Icons.Rounded.AssignmentTurnedIn, BrandSuccess, BrandSuccessLight),
        Stat("Pending Filings", "12", Icons.Rounded.Schedule, BrandWarning, BrandWarningLight),
        Stat("Overdue Tasks", "3", Icons.Rounded.ErrorOutline, BrandDanger, BrandDangerLight)
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
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                    Text(
                        "Business Portal",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Gray900)
                    )
                }
            }
        },
        containerColor = Gray50
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Text(
                "Dashboard",
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, color = Gray900)
            )
            Text(
                "Welcome back, Priya. Here's your overview for today.",
                style = MaterialTheme.typography.bodyMedium.copy(color = Gray500),
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // Statistics Grid (using a Column with Rows for simple layout in LazyColumn or just Column)
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    StatCard(stat = stats[0], modifier = Modifier.weight(1f))
                    StatCard(stat = stats[1], modifier = Modifier.weight(1f))
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    StatCard(stat = stats[2], modifier = Modifier.weight(1f))
                    StatCard(stat = stats[3], modifier = Modifier.weight(1f))
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Recent Filings Placeholder
            Card(
                modifier = Modifier.fillMaxWidth().height(200.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Recent Filings", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("Chart / Table will go here", color = Gray400)
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(stat: Stat, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(stat.bgColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(stat.icon, contentDescription = null, tint = stat.color, modifier = Modifier.size(24.dp))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(stat.title, style = MaterialTheme.typography.labelMedium.copy(color = Gray500))
            Text(stat.value, style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold, color = Gray900))
        }
    }
}
