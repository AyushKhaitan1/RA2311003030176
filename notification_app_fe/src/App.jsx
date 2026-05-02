import { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Card, CardContent, Chip, TextField, Select, MenuItem, Button, Grid } from '@mui/material';
import Log from '../../logging middleware/logger.js';

export default function App() {
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => JSON.parse(localStorage.getItem('readIds')) || []);
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchNotifications = async () => {
    await Log("frontend", "info", "api", `Fetching tab ${tab} data`);
    try {
      const endpoint = tab === 0
        ? `http://localhost:3001/api/notifications?${typeFilter ? 'notification_type='+typeFilter : ''}`
        : `http://localhost:3001/api/notifications/priority?n=${limit}${typeFilter ? '&notification_type='+typeFilter : ''}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      await Log("frontend", "error", "api", "Fetch failed");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [tab, limit, typeFilter]);

  const markAsRead = async (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem('readIds', JSON.stringify(updated));
      await Log("frontend", "info", "state", `Notification ${id} marked read`);
    }
  };

  const getTypeColor = (type) => {
    if(type.toLowerCase() === 'placement') return 'success';
    if(type.toLowerCase() === 'result') return 'primary';
    return 'default';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Campus Notifications Platform</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)} 
            displayEmpty 
            size="small"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </Grid>
        {tab === 1 && (
          <Grid item>
            <TextField 
              label="Top N Limit" 
              type="number" 
              size="small" 
              value={limit} 
              onChange={(e) => setLimit(e.target.value)} 
              sx={{ width: 120 }} 
            />
          </Grid>
        )}
      </Grid>

      <Box>
        {notifications.map((n) => {
          const isRead = readIds.includes(n.ID);
          return (
            <Card key={n.ID} sx={{ mb: 2, opacity: isRead ? 0.6 : 1, borderLeft: isRead ? '4px solid #9e9e9e' : '4px solid #1976d2' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Chip label={n.Type} color={getTypeColor(n.Type)} size="small" />
                  <Typography variant="caption" color="text.secondary">{new Date(n.Timestamp).toLocaleString()}</Typography>
                </Box>
                <Typography variant="body1">{n.Message}</Typography>
                {!isRead && (
                  <Button size="small" variant="contained" sx={{ mt: 2 }} onClick={() => markAsRead(n.ID)}>
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {notifications.length === 0 && <Typography>No notifications found.</Typography>}
      </Box>
    </Container>
  );
}