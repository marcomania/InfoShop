import React from "react";
import { Box, Drawer, Typography, Divider, Button } from "@mui/material";

const LeftSideBar = ({addBlock})=>{
    return(
        <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
                }}
            >
                <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                        Blocks
                    </Typography>
                    <Divider />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => addBlock("core/paragraph")}
                    >
                        Add Paragraph
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => addBlock("core/image")}
                    >
                        Add Image
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => addBlock("core/container")}
                    >
                        Add Container
                    </Button>
                </Box>
            </Drawer>
    )
}

export default LeftSideBar;