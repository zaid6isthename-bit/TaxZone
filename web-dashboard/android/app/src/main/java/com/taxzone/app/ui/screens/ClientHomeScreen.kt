package com.taxzone.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taxzone.app.ui.theme.*

data class Filing(
    val type: String,
    val period: String,
    val status: String,
    val progress: Int
)

data class Deadline(
    val date: String,
    val month: String,
    val title: String,
    val status: String
)

@Composable
fun ClientHomeScreen(
    onNavigateToDocuments: () -> Unit,
    onNavigateToFiling: () -> Unit,
    onNavigateToNotifications: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onBack: () -> Unit
) {
    val filings = listOf(
        Filing("GSTR-1", "October 2024", "Under Review", 60),
        Filing("ITR", "FY 2024-25", "In Progress", 40),
        Filing("TDS", "Q2 FY 2024-25", "Completed", 100)
    )

    val deadlines = listOf(
        Deadline("31", "Oct", "GSTR-1 October", "Under Review"),
        Deadline("20", "Nov", "GSTR-3B November", "Not Started"),
        Deadline("31", "Dec", "GSTR-9 Annual", "Not Started")
    )

    Scaffold(
        topBar = {
            DashboardAppBar(
                onNotificationClick = onNavigateToNotifications,
                onProfileClick = onNavigateToProfile
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {
            // Action Banner
            item {
                ActionBanner(onClick = onNavigateToDocuments)
            }

            // Your Filings Section
            item {
                SectionHeader(title = "Your Filings", onActionClick = onNavigateToFiling)
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.padding(bottom = 16.dp)
                ) {
                    items(filings) { filing ->
                        FilingCard(filing = filing, onClick = onNavigateToFiling)
                    }
                }
            }

            // Upcoming Deadlines Section
            item {
                SectionHeader(title = "Upcoming Deadlines", showAction = false)
            }
            items(deadlines) { deadline ->
                DeadlineCard(deadline = deadline, modifier = Modifier.padding(horizontal = 16.dp, vertical = 5.dp))
            }

            // Your CA Team Section
            item {
                Spacer(modifier = Modifier.height(16.dp))
                CATeamCard(modifier = Modifier.padding(horizontal = 16.dp))
            }
        }
    }
}

@Composable
fun DashboardAppBar(onNotificationClick: () -> Unit, onProfileClick: () -> Unit) {
    Surface(
        color = Color.White,
        shadowElevation = 2.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onProfileClick() }
            ) {
                // Avatar
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(BrandPrimary, BrandIndigo)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        "RK",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    "Hi, Rajesh 👋",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = Gray900
                    )
                )
            }
            Row {
                IconButton(onClick = onNotificationClick) {
                    BadgedBox(badge = {
                        Badge(
                            containerColor = BrandDanger,
                            modifier = Modifier.size(8.dp).offset(x = (-4).dp, y = 4.dp)
                        )
                    }) {
                        Icon(Icons.Rounded.Notifications, contentDescription = "Notifications", tint = Gray700)
                    }
                }
                IconButton(onClick = onProfileClick) {
                    Icon(Icons.Rounded.Settings, contentDescription = "Settings", tint = Gray700)
                }
            }
        }
    }
}

@Composable
fun ActionBanner(onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(BrandPrimaryLight)
            .clickable { onClick() }
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color.White)
                        .shadow(1.dp, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Rounded.CloudUpload, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(20.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        "Documents Requested",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Gray900)
                    )
                    Text(
                        "3 documents need your attention",
                        style = MaterialTheme.typography.labelMedium.copy(color = Gray500)
                    )
                }
            }
            Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = BrandPrimary)
        }
    }
}

@Composable
fun SectionHeader(title: String, showAction: Boolean = true, onActionClick: () -> Unit = {}) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            title,
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Gray900)
        )
        if (showAction) {
            TextButton(onClick = onActionClick) {
                Text("See All", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = BrandPrimary))
            }
        }
    }
}

@Composable
fun FilingCard(filing: Filing, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .width(190.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Surface(
                color = BrandPrimaryLight,
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    filing.type,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.ExtraBold,
                        color = BrandPrimary,
                        letterSpacing = 0.5.sp
                    )
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                filing.period,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Gray900)
            )
            Spacer(modifier = Modifier.height(4.dp))
            StatusBadge(status = filing.status)
            
            Spacer(modifier = Modifier.height(14.dp))
            LinearProgressIndicator(
                progress = { filing.progress / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(5.dp)
                    .clip(CircleShape),
                color = if (filing.progress == 100) BrandSuccess else BrandPrimary,
                trackColor = Gray200
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Rounded.CalendarToday, contentDescription = null, modifier = Modifier.size(11.dp), tint = Gray400)
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    if (filing.progress == 100) "Filed successfully" else "${filing.progress}% complete",
                    style = MaterialTheme.typography.labelSmall.copy(color = Gray400)
                )
            }
        }
    }
}

@Composable
fun DeadlineCard(deadline: Deadline, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Date Badge
                Column(
                    modifier = Modifier
                        .size(width = 48.dp, height = 52.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(BrandPrimaryLight),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(deadline.date, style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, color = BrandPrimary))
                    Text(deadline.month, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = BrandPrimary))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(deadline.title, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold, color = Gray900))
                    Spacer(modifier = Modifier.height(4.dp))
                    StatusBadge(status = deadline.status)
                }
            }
            Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = Gray400)
        }
    }
}

@Composable
fun CATeamCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                "YOUR CA TEAM",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = Gray400,
                    letterSpacing = 1.sp
                )
            )
            Spacer(modifier = Modifier.height(14.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(BrandSuccess, BrandInfo)
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("PS", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Priya Sharma", style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold, color = Gray900))
                        Text("Tax Associate", style = MaterialTheme.typography.bodyMedium.copy(color = Gray500))
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TeamActionButton(icon = Icons.Rounded.Phone, color = BrandPrimary, bgColor = BrandPrimaryLight)
                    TeamActionButton(icon = Icons.Rounded.Chat, color = BrandSuccess, bgColor = BrandSuccessLight)
                }
            }
        }
    }
}

@Composable
fun TeamActionButton(icon: ImageVector, color: Color, bgColor: Color) {
    Surface(
        modifier = Modifier
            .size(40.dp)
            .clickable { },
        shape = CircleShape,
        color = bgColor,
        border = androidx.compose.foundation.BorderStroke(1.5.dp, color)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(17.dp))
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (color, bgColor) = when (status) {
        "Under Review" -> BrandPrimary to BrandPrimaryLight
        "In Progress" -> BrandInfo to BrandInfoLight
        "Completed" -> BrandSuccess to BrandSuccessLight
        "Not Started" -> Gray500 to Gray100
        "Overdue" -> BrandDanger to BrandDangerLight
        else -> Gray500 to Gray100
    }
    Surface(
        color = bgColor,
        shape = RoundedCornerShape(4.dp)
    ) {
        Text(
            status,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 2.dp),
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = color)
        )
    }
}
