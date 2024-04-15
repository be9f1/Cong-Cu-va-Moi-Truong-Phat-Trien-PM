import { IBackendRes, IFilm, IAccount, IUser, IModelPaginate, IGetAccount, ICinema, IRoom, ITicket, IRole, IPermission } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', file);
    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType
        },
    });
}




/**
 * 
Module Film
 */
export const callCreateFilm = (film: IFilm) => {
    return axios.post<IBackendRes<IFilm>>('/api/v1/films', { ...film })
}

export const callUpdateFilm = (film: IFilm, id: string) => {
    return axios.patch<IBackendRes<IFilm>>(`/api/v1/films/${id}`, { ...film })
}

export const callDeleteFilm = (id: string) => {
    return axios.delete<IBackendRes<IFilm>>(`/api/v1/films/${id}`);
}

export const callFetchFilm = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IFilm>>>(`/api/v1/films?${query}`);
}
export const callFetchFilmById = (id: string) => {
    return axios.get<IBackendRes<IFilm>>(`/api/v1/films/${id}`);
}

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

/**
 * 
Module Cinema
 */
export const callCreateCinema = (name: string, address: string, description: string, logo: string) => {
    return axios.post<IBackendRes<ICinema>>('/api/v1/cinemas', { name, address, description, logo })
}

export const callUpdateCinema = (id: string, name: string, address: string, description: string, logo: string) => {
    return axios.patch<IBackendRes<ICinema>>(`/api/v1/cinemas/${id}`, { name, address, description, logo })
}

export const callDeleteCinema = (id: string) => {
    return axios.delete<IBackendRes<ICinema>>(`/api/v1/cinemas/${id}`);
}

export const callFetchCinema = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICinema>>>(`/api/v1/cinemas?${query}`);
}

export const callFetchCinemaById = (id: string) => {
    return axios.get<IBackendRes<ICinema>>(`/api/v1/cinemas/${id}`);
}

/**
 * 
Module Room
 */
export const callCreateRoom = (room: IRoom) => {
    return axios.post<IBackendRes<IRoom>>('/api/v1/rooms', { ...room })
}

export const callUpdateRoom = (room: IRoom, id: string) => {
    return axios.patch<IBackendRes<IRoom>>(`/api/v1/rooms/${id}`, { ...room })
}

export const callDeleteRoom = (id: string) => {
    return axios.delete<IBackendRes<IRoom>>(`/api/v1/rooms/${id}`);
}

export const callFetchRoom = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRoom>>>(`/api/v1/rooms?${query}`);
}

export const callFetchRoomById = (id: string) => {
    return axios.get<IBackendRes<IRoom>>(`/api/v1/rooms/${id}`);
}

/**
 * 
Module Ticket
 */
export const callCreateTicket = (url: string, roomId: any, filmId: any) => {
    return axios.post<IBackendRes<ITicket>>('/api/v1/tickets', { url, roomId, filmId })
}

export const callUpdateTicketStatus = (id: any, status: string) => {
    return axios.patch<IBackendRes<ITicket>>(`/api/v1/tickets/${id}`, { status })
}

export const callDeleteTicket = (id: string) => {
    return axios.delete<IBackendRes<ITicket>>(`/api/v1/tickets/${id}`);
}

export const callFetchTicket = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITicket>>>(`/api/v1/tickets?${query}`);
}

export const callFetchTicketById = (id: string) => {
    return axios.get<IBackendRes<ITicket>>(`/api/v1/tickets/${id}`);
}

export const callFetchTicketByUser = () => {
    return axios.post<IBackendRes<ITicket>>(`/api/v1/tickets/by-user`);
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, { ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}