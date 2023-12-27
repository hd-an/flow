import { Info } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import parser from 'html-react-parser'
import PropTypes from 'prop-types'

export const TooltipWithParser = ({ title, style }) => {
    return (
        <Tooltip title={parser(title)} placement='right'>
            <IconButton sx={{ height: 15, width: 15 }}>
                <Info
                    style={{
                        ...style,
                        background: 'transparent',
                        height: 15,
                        width: 15
                    }}
                />
            </IconButton>
        </Tooltip>
    )
}

TooltipWithParser.propTypes = {
    title: PropTypes.node,
    style: PropTypes.any
}
