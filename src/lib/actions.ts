"use server";

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function dbAddTodo(title: string, description: string | null) {
  try {

    ////////// prisma 
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
      },
    });
    ////////// prisma 

    revalidatePath('/');
    return todo;
  } catch (error) {
    console.error('Error adding todo:', error);
    return null;
  }
}

export async function dbGetTodos() {
  try {

    ////////// prisma 
    return await prisma.todo.findMany({
      include: {
        assignees: {
          include: {     // substitutes classical sql `join`stunts
            idiot: true
          }
        }
      }
    });
    ////////// prisma 

  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
}

export async function dbAddAssignee(name: string) {
  try {

    ////////// prisma 
    const assignee = await prisma.idiotWhoHasToDoIt.create({
      data: { name },
    });
    ////////// prisma 
    
    revalidatePath('/');
    return assignee;
  } catch (error) {
    console.error('Error adding assignee:', error);
    return null;
  }
}

export async function dbGetAssignees() {
  try {

    ////////// prisma 
    return await prisma.idiotWhoHasToDoIt.findMany();
    ////////// prisma 

  } catch (error) {
    console.error('Error getting assignees:', error);
    return [];
  }
}

export async function dbAssignTodo(todoId: string, idiotId: string) {
  try {

    ////////// prisma 
    await prisma.join_Todo_IdiotWhoHasToDoIt.create({
      data: {
        todoId,
        idiotId,
      },
    });
    ////////// prisma 

    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Error assigning todo:', error);
    return false;
  }
}

export async function dbCompleteTodo(id: string) {
  try {

    ////////// prisma 
    const todo = await prisma.todo.update({
      where: { id },
      data: { completed: true },  // this way we express a `where` clause
    });
    ////////// prisma 

    revalidatePath('/');
    return todo;
  } catch (error) {
    console.error('Error completing todo:', error);
    return null;
  }
}