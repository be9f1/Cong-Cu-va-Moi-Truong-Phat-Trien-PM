import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { CreateUserDto, RegisterUserDto } from "src/users/dto/user.dto";
import { LocalAuthGuard } from "./local-auth.guard";
import { Request, Response } from "express";
import { IUser } from "src/users/users.interface";
import { RolesService } from "src/roles/roles.service";

@Controller('auth') 
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService,
  ) { }

 @Public()
 @ResponseMessage('Login success')
 @UseGuards(LocalAuthGuard)
 @Post('/login')
 handleLogin(
  @Req() req,
  @Res({passthrough: true}) response: Response,
 ) {
   return this.authService.login(req.user, response);
 }

 @Public()
 @ResponseMessage('Register success')
 @Post('/register')
 handleRegister(
  @Body() registerUserDto: RegisterUserDto) {
     return this.authService.register(registerUserDto);
 }

 @ResponseMessage('Get user information')
 @Get('/account')
 async handleGetAccount(@User() user: IUser) {
   const temp = await this.roleService.findOne(user.role._id) as any;
   user.permissions = temp.permissions;
   return { user };
 }

 @Public()
 @ResponseMessage('Get user refresh token')
 @Get('/refresh')
 handleRefreshToken(
  @Req() req: Request,
  @Res({passthrough: true}) response: Response,
 ) {
  const refreshToken = req.cookies['refresh_token'];
  return this.authService.processNewToken(refreshToken, response);
 }

 @ResponseMessage('Logout success')
 @Post('/logout')
 handleLogout(
  @Res({passthrough: true}) response: Response,
  @User() user: IUser,
 ) {
  return this.authService.logout(response, user);
 }
}