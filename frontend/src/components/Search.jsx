import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

export const SearchWrapper = styled('div')(({ theme }) => ({
    position: 'relative',

    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '12ch',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export const Search = ({ onSearch }) => {
    const handleSearch = (event) => {
        const query = event.target.value;
        onSearch(query);
    };

    return (
        <SearchWrapper>
            <StyledInputBase

                placeholder="חפש..."
                inputProps={{ 'aria-label': 'חיפוש' }}
                onChange={handleSearch}
            />
            <SearchIcon style={{ color: '#4fc3f7', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </SearchWrapper>
    );
};

export default Search;