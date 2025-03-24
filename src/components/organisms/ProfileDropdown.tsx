import { DropdownMenu } from "../ui/dropdown-menu";

const ProfileDropdown = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <div className={isMobile ? "block md:hidden" : "caca hidden md:block"}>
            <DropdownMenu>
                <p>User test</p>
            </DropdownMenu>
        </div>
    );
};

export default ProfileDropdown;
